import type { JSONSchema7 } from "ai";
import type {
	FlowEdge,
	FlowNode,
} from "@/registry/blocks/workflow-01/lib/workflow/types";
import { isNodeOfType } from "@/registry/blocks/workflow-01/lib/workflow/types";
import {
	type ParsedSchemaProperty,
	parseJSONSchema,
} from "./json-schema-utils";

export type VariableInfo = {
	path: string;
	type: string;
	description?: string;
	children?: VariableInfo[];
};

export function getAvailableVariables(
	nodeId: string,
	nodes: FlowNode[],
	edges: FlowEdge[],
): VariableInfo[] {
	const incomingEdges = edges.filter((edge) => edge.target === nodeId);

	if (incomingEdges.length === 0) {
		return [];
	}

	const inputEdge = incomingEdges.find(
		(edge) => edge.targetHandle === "input",
	);

	if (!inputEdge) {
		return [];
	}

	const sourceNode = nodes.find((node) => node.id === inputEdge.source);

	if (!sourceNode) {
		return [];
	}

	if (isNodeOfType(sourceNode, "agent")) {
		const sourceType = sourceNode.data.sourceType;

		if (sourceType.type === "structured" && sourceType.schema) {
			return extractVariablesFromSchema(sourceType.schema, "input");
		}

		return [
			{
				path: "input",
				type: "string",
				description: "Text output from previous node",
			},
		];
	}

	return [
		{
			path: "input",
			type: "any",
			description: "Input from previous node",
		},
	];
}

function extractVariablesFromSchema(
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

/**
 * Extract all variable references from a JEXL condition string
 * Returns paths like: "input", "input.success", "input.user.name"
 */
export function extractVariableReferences(condition: string): string[] {
	const references: string[] = [];

	const stringRegex = /(['"])((?:\\.|(?!\1).)*?)\1/g;
	const conditionWithoutStrings = condition.replace(stringRegex, '""');

	const variablePathRegex =
		/\b[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)*/g;

	const keywords = new Set(["true", "false", "null", "in", "matches"]);

	let match: RegExpExecArray | null;
	// biome-ignore lint/suspicious/noAssignInExpressions: This is a common pattern for regex matching
	while ((match = variablePathRegex.exec(conditionWithoutStrings)) !== null) {
		const reference = match[0];
		if (!keywords.has(reference)) {
			references.push(reference);
		}
	}

	return references;
}

/**
 * Check if a variable path is available in the given variables
 * Also checks parent paths (e.g., if "input" exists, "input.field" is considered available)
 */
export function isVariableAvailable(
	path: string,
	availableVariables: VariableInfo[],
): boolean {
	const validPaths = buildVariablePathSet(availableVariables);

	if (validPaths.has(path)) {
		return true;
	}

	const pathParts = path.split(".");
	for (let i = pathParts.length - 1; i > 0; i--) {
		const parentPath = pathParts.slice(0, i).join(".");
		const parentVar = findVariableByPath(parentPath, availableVariables);
		if (
			parentVar &&
			(parentVar.type === "object" || parentVar.type === "any")
		) {
			return true;
		}
	}

	return false;
}

/**
 * Find a variable by its path
 */
function findVariableByPath(
	path: string,
	variables: VariableInfo[],
): VariableInfo | null {
	for (const variable of variables) {
		if (variable.path === path) {
			return variable;
		}
		if (variable.children) {
			const found = findVariableByPath(path, variable.children);
			if (found) {
				return found;
			}
		}
	}
	return null;
}
