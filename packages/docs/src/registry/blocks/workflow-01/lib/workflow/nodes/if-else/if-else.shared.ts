import { Environment } from "@marcbachmann/cel-js";
import type { Node } from "@xyflow/react";
import { z } from "zod";
import {
	areSchemasIdentical,
	convertSchemaToCelDeclarations,
} from "@/registry/blocks/workflow-01/lib/workflow/context/schema-introspection";
import { getPotentialInputSchemas } from "@/registry/blocks/workflow-01/lib/workflow/context/variable-resolver";
import type {
	NodeSharedDefinition,
	ValidationContext,
} from "@/registry/blocks/workflow-01/types/workflow";
import {
	isNodeOfType,
	type ValidationError,
} from "@/registry/blocks/workflow-01/types/workflow";

const dynamicHandleSchema = z.object({
	id: z.string(),
	label: z.string().nullable(),
	condition: z.string(),
});

export const ifElseNodeDataSchema = z.object({
	status: z.enum(["processing", "error", "success", "idle"]).optional(),
	dynamicSourceHandles: z.array(dynamicHandleSchema),
	validationErrors: z.array(z.any()).optional(),
});

export type IfElseNodeData = z.infer<typeof ifElseNodeDataSchema>;
export type IfElseNode = Node<IfElseNodeData, "if-else">;

/**
 * Validates if-else node configuration, connection constraints, and condition expressions.
 * Validates that conditions are syntactically correct using CEL and reference available variables.
 * Validates conditions against ALL potential input schemas to ensure safety across converging paths.
 */
function validateIfElseNode(
	node: IfElseNode,
	context: ValidationContext,
): ValidationError[] {
	const errors: ValidationError[] = [];

	const { nodes, edges } = context;

	const outgoingEdges = edges.filter(e => e.source === node.id);

	if (outgoingEdges.length === 0) {
		errors.push({
			type: "invalid-node-config",
			severity: "error",
			message: "If-else node must have at least one outgoing connection",
			node: { id: node.id },
		});
	}

	// Get all potential input schemas for multi-path validation
	const potentialInputSchemas = getPotentialInputSchemas(node.id, nodes, edges);

	// Check for schema mismatch warning
	if (potentialInputSchemas.length > 1) {
		const schemas = potentialInputSchemas
			.map(source => source.schema)
			.filter(
				(
					schema,
				): schema is NonNullable<
					(typeof potentialInputSchemas)[number]["schema"]
				> => schema !== null,
			);

		if (schemas.length > 1 && !areSchemasIdentical(schemas)) {
			errors.push({
				type: "invalid-node-config",
				severity: "warning",
				message:
					"Multiple input paths with different schemas detected. Conditions must be valid for all converging paths. Ensure all paths have compatible schemas.",
				node: { id: node.id },
			});
		}
	}

	for (const handle of node.data.dynamicSourceHandles) {
		const edgeForHandle = outgoingEdges.find(e => e.sourceHandle === handle.id);
		if (edgeForHandle && !handle.condition.trim()) {
			errors.push({
				type: "invalid-node-config",
				severity: "error",
				message: `If-else condition "${handle.label || handle.id}" has a connection but no condition expression`,
				node: { id: node.id },
			});
		}

		if (handle.condition?.trim()) {
			const hasIncomingEdge = edges.some(
				e => e.target === node.id && e.targetHandle === "input",
			);

			if (!hasIncomingEdge) {
				// Validate syntax only when no input connection
				try {
					const env = new Environment();
					const checkResult = env.check(handle.condition);
					if (!checkResult.valid && checkResult.error) {
						errors.push({
							type: "invalid-condition",
							severity: "error",
							message: "Invalid condition expression syntax",
							condition: {
								nodeId: node.id,
								handleId: handle.id,
								condition: handle.condition,
								error: checkResult.error.message,
							},
						});
					}
				} catch (error) {
					errors.push({
						type: "invalid-condition",
						severity: "error",
						message: "Invalid condition expression syntax",
						condition: {
							nodeId: node.id,
							handleId: handle.id,
							condition: handle.condition,
							error: error instanceof Error ? error.message : String(error),
						},
					});
				}
			} else {
				// Validate against all potential input schemas
				if (potentialInputSchemas.length === 0) {
					// No input sources - validate syntax only
					try {
						const env = new Environment();
						env.check(handle.condition);
					} catch (error) {
						errors.push({
							type: "invalid-condition",
							severity: "error",
							message: "Invalid condition expression syntax",
							condition: {
								nodeId: node.id,
								handleId: handle.id,
								condition: handle.condition,
								error: error instanceof Error ? error.message : String(error),
							},
						});
					}
				} else {
					// Validate against each potential input schema
					for (const source of potentialInputSchemas) {
						try {
							const env = new Environment();

							// Register types and variables based on schema
							if (source.schema) {
								const conversion = convertSchemaToCelDeclarations(
									source.schema,
								);

								// Register all nested types first (they're already in dependency order)
								for (const typeDef of conversion.typeDefinitions) {
									// Create a dummy constructor class for CEL
									class DummyType {}
									env.registerType(typeDef.typename, {
										ctor: DummyType,
										fields: typeDef.fields,
									});
								}

								// Register the root variable
								env.registerVariable(
									conversion.variableDeclaration.name,
									conversion.variableDeclaration.type,
								);
							} else {
								// Text output - register basic input as string
								env.registerVariable("input", "string");
							}

							const checkResult = env.check(handle.condition);

							// Report validation errors
							if (!checkResult.valid && checkResult.error) {
								const sourceNode = nodes.find(n => n.id === source.nodeId);
								const nodeName =
									sourceNode && isNodeOfType(sourceNode, "agent")
										? sourceNode.data.name
										: source.nodeName || source.nodeId;

								const errorMessage = checkResult.error.message;

								// Extract field name from error message if possible
								let enhancedMessage = errorMessage;
								const fieldMatch = errorMessage.match(/No such key: (\w+)/);
								if (fieldMatch) {
									const fieldName = fieldMatch[1];
									enhancedMessage = `Field 'input.${fieldName}' not found in schema from '${nodeName}'. Ensure all converging paths have compatible schemas.`;
								} else if (errorMessage.includes("Unknown variable")) {
									// Extract variable name from error
									const varMatch = errorMessage.match(
										/Unknown variable: (\S+)/,
									);
									if (varMatch) {
										const varName = varMatch[1];
										enhancedMessage = `Variable '${varName}' not found in schema from '${nodeName}'. Ensure all converging paths have compatible schemas.`;
									}
								}

								errors.push({
									type: "invalid-condition",
									severity: "error",
									message: `Expression failed validation for input from '${nodeName}': ${enhancedMessage}`,
									condition: {
										nodeId: node.id,
										handleId: handle.id,
										condition: handle.condition,
										error: enhancedMessage,
									},
								});
							}
						} catch (error) {
							// Catch syntax errors and other exceptions
							const sourceNode = nodes.find(n => n.id === source.nodeId);
							const nodeName =
								sourceNode && isNodeOfType(sourceNode, "agent")
									? sourceNode.data.name
									: source.nodeName || source.nodeId;

							errors.push({
								type: "invalid-condition",
								severity: "error",
								message: `Expression failed validation for input from '${nodeName}': ${
									error instanceof Error ? error.message : String(error)
								}`,
								condition: {
									nodeId: node.id,
									handleId: handle.id,
									condition: handle.condition,
									error: error instanceof Error ? error.message : String(error),
								},
							});
						}
					}
				}
			}
		}
	}

	return errors;
}

export const ifElseSharedDefinition: NodeSharedDefinition<IfElseNode> = {
	type: "if-else",
	dataSchema: ifElseNodeDataSchema,
	validate: validateIfElseNode,
};
