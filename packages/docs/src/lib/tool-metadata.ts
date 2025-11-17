import type { JSONSchema7 } from "ai";
import { z } from "zod";

export type ToolDetails = {
	name: string;
	description: string;
	inputSchema: JSONSchema7 | null;
	outputSchema: JSONSchema7 | null;
};

export async function getToolDetails(
	toolId: string,
): Promise<ToolDetails | null> {
	try {
		const toolModule = await import(`@/registry/ai/tools/${toolId}.ts`);
		const toolExport = Object.values(toolModule).find(
			(exported): exported is Record<string, unknown> =>
				typeof exported === "object" &&
				exported !== null &&
				"name" in exported &&
				"description" in exported,
		);

		if (!toolExport) {
			return null;
		}

		// Convert Zod schemas to JSON Schema using z.toJSONSchema()
		let inputSchema: JSONSchema7 | null = null;
		let outputSchema: JSONSchema7 | null = null;

		if (
			toolExport.inputSchema &&
			typeof toolExport.inputSchema === "object"
		) {
			try {
				inputSchema = z.toJSONSchema(
					toolExport.inputSchema as z.ZodTypeAny,
				);
				console.log("inputSchema", inputSchema);
			} catch (error) {
				console.warn(
					`Failed to convert input schema for ${toolId}:`,
					error,
				);
			}
		}

		if (
			toolExport.outputSchema &&
			typeof toolExport.outputSchema === "object"
		) {
			try {
				outputSchema = z.toJSONSchema(
					toolExport.outputSchema as z.ZodTypeAny,
				);
				console.log("outputSchema", outputSchema);
			} catch (error) {
				console.warn(
					`Failed to convert output schema for ${toolId}:`,
					error,
				);
			}
		}

		return {
			name: toolExport.name as string,
			description: toolExport.description as string,
			inputSchema,
			outputSchema,
		};
	} catch (error) {
		console.warn(`Failed to load tool details for ${toolId}:`, error);
		return null;
	}
}
