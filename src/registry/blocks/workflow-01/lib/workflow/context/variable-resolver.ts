import type { JSONSchema7 } from "ai";
import {
	type ParsedSchemaProperty,
	parseJSONSchema,
} from "@/registry/blocks/workflow-01/lib/workflow/context/schema-introspection";
import {
	type FlowEdge,
	type FlowNode,
	isNodeOfType,
} from "@/registry/blocks/workflow-01/lib/workflow/types";

export type VariableInfo = {
	path: string;
	type: string;
	description?: string;
	children?: VariableInfo[];
};

export type VariableTag = "common" | "path-specific";

export type TaggedVariableInfo = VariableInfo & {
	tag: VariableTag;
	sourceNodeIds: string[]; // Which nodes provide this variable
};

export type InputSource = {
	nodeId: string;
	nodeName?: string;
	schema: JSONSchema7 | null; // null means text output (no structured schema)
};

/**
 * Get all potential input schemas for a target node
 * Returns an array of input sources, each with their schema
 */
export function getPotentialInputSchemas(
	targetNodeId: string,
	nodes: FlowNode[],
	edges: FlowEdge[],
): InputSource[] {
	const incomingEdges = edges.filter(
		(edge) => edge.target === targetNodeId && edge.targetHandle === "input",
	);

	if (incomingEdges.length === 0) {
		return [];
	}

	const inputSources: InputSource[] = [];

	for (const edge of incomingEdges) {
		const sourceNode = nodes.find((node) => node.id === edge.source);

		if (!sourceNode) {
			continue;
		}

		let schema: JSONSchema7 | null = null;
		let nodeName: string | undefined;

		if (isNodeOfType(sourceNode, "agent")) {
			nodeName = sourceNode.data.name;
			const sourceType = sourceNode.data.sourceType;

			if (sourceType.type === "structured" && sourceType.schema) {
				schema = sourceType.schema;
			}
			// If not structured, schema remains null (text output)
		} else {
			// For non-agent nodes, assume text output (no structured schema)
			schema = null;
		}

		inputSources.push({
			nodeId: sourceNode.id,
			nodeName,
			schema,
		});
	}

	return inputSources;
}

/**
 * Build union of variables from all potential input schemas
 * Tags variables as "common" (in all schemas) or "path-specific" (in some but not all)
 */
export function getUnionOfVariables(
	nodeId: string,
	nodes: FlowNode[],
	edges: FlowEdge[],
): TaggedVariableInfo[] {
	const inputSources = getPotentialInputSchemas(nodeId, nodes, edges);

	if (inputSources.length === 0) {
		return [];
	}

	// Extract variables from each source
	const variablesBySource = inputSources.map((source) => {
		if (source.schema) {
			return {
				sourceNodeId: source.nodeId,
				variables: extractVariablesFromSchema(source.schema, "input"),
			};
		}
		// Text output - return basic input variable
		return {
			sourceNodeId: source.nodeId,
			variables: [
				{
					path: "input",
					type: "string",
					description: "Text output from previous node",
				},
			],
		};
	});

	// Build a map of all unique variable paths
	const variableMap = new Map<
		string,
		{
			variable: VariableInfo;
			sourceNodeIds: Set<string>;
		}
	>();

	// Collect all variables and track which sources provide them
	for (const { sourceNodeId, variables } of variablesBySource) {
		function addVariables(vars: VariableInfo[], parentPath?: string) {
			for (const variable of vars) {
				const fullPath = parentPath
					? `${parentPath}.${variable.path.split(".").pop()}`
					: variable.path;

				if (!variableMap.has(fullPath)) {
					variableMap.set(fullPath, {
						variable: { ...variable, path: fullPath },
						sourceNodeIds: new Set(),
					});
				}
				variableMap.get(fullPath)?.sourceNodeIds.add(sourceNodeId);

				if (variable.children) {
					addVariables(variable.children, fullPath);
				}
			}
		}
		addVariables(variables);
	}

	// Convert to tagged variables
	const totalSources = inputSources.length;
	const taggedVariables: TaggedVariableInfo[] = [];

	for (const [, { variable, sourceNodeIds }] of variableMap) {
		const tag: VariableTag =
			sourceNodeIds.size === totalSources ? "common" : "path-specific";

		taggedVariables.push({
			...variable,
			tag,
			sourceNodeIds: Array.from(sourceNodeIds),
		});
	}

	// Sort: common variables first, then path-specific
	taggedVariables.sort((a, b) => {
		if (a.tag === "common" && b.tag === "path-specific") {
			return -1;
		}
		if (a.tag === "path-specific" && b.tag === "common") {
			return 1;
		}
		return a.path.localeCompare(b.path);
	});

	return taggedVariables;
}

export function extractVariablesFromSchema(
	schema: JSONSchema7,
	basePath: string,
): VariableInfo[] {
	const parsedProperties = parseJSONSchema(schema);

	return convertParsedToVariableInfo(parsedProperties, basePath);
}

function convertParsedToVariableInfo(
	properties: Record<string, ParsedSchemaProperty>,
	basePath: string,
): VariableInfo[] {
	const variables: VariableInfo[] = [];

	for (const [key, parsed] of Object.entries(properties)) {
		const path = `${basePath}.${key}`;

		const variable: VariableInfo = {
			path,
			type: parsed.type,
			description: parsed.description,
		};

		if (parsed.type === "object" && parsed.properties) {
			variable.children = convertParsedToVariableInfo(
				parsed.properties,
				path,
			);
		}

		if (parsed.isArray && parsed.properties) {
			variable.children = convertParsedToVariableInfo(
				parsed.properties,
				`${path}[0]`,
			);
		}

		variables.push(variable);
	}

	return variables;
}

/**
 * Build a set of all available variable paths from a VariableInfo array
 */
export function buildVariablePathSet(variables: VariableInfo[]): Set<string> {
	const paths = new Set<string>();

	function addPaths(vars: VariableInfo[]) {
		for (const variable of vars) {
			paths.add(variable.path);
			if (variable.children) {
				addPaths(variable.children);
			}
		}
	}

	addPaths(variables);
	return paths;
}
