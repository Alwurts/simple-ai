import type { JSONSchema7 } from "ai";

export interface ParsedSchemaProperty {
	type: string;
	isArray: boolean;
	description?: string;
	properties?: Record<string, ParsedSchemaProperty>;
	enumValues?: string[];
}

export interface ParsedSchemaPropertyWithChildren extends ParsedSchemaProperty {
	properties?: Record<string, ParsedSchemaProperty>;
}

export function parseJSONSchemaProperty(
	prop: Record<string, unknown>,
): ParsedSchemaProperty {
	const result: ParsedSchemaProperty = {
		type: "string",
		isArray: false,
	};

	if (prop.type === "array" && prop.items && typeof prop.items === "object") {
		result.isArray = true;
		const items = prop.items as Record<string, unknown>;

		if (typeof items.type === "string") {
			result.type = items.type;
		}

		if (items.enum && Array.isArray(items.enum)) {
			result.type = "enum";
			result.enumValues = items.enum.map(String);
		}

		if (
			items.type === "object" &&
			items.properties &&
			typeof items.properties === "object"
		) {
			result.type = "object";
			result.properties = {};

			for (const [nestedName, nestedProp] of Object.entries(
				items.properties as Record<string, unknown>,
			)) {
				if (typeof nestedProp === "object" && nestedProp !== null) {
					result.properties[nestedName] = parseJSONSchemaProperty(
						nestedProp as Record<string, unknown>,
					);
				}
			}
		}
	} else {
		if (typeof prop.type === "string") {
			result.type = prop.type;
		}

		if (prop.enum && Array.isArray(prop.enum)) {
			result.type = "enum";
			result.enumValues = prop.enum.map(String);
		}

		if (
			prop.type === "object" &&
			prop.properties &&
			typeof prop.properties === "object"
		) {
			result.properties = {};

			for (const [nestedName, nestedProp] of Object.entries(
				prop.properties as Record<string, unknown>,
			)) {
				if (typeof nestedProp === "object" && nestedProp !== null) {
					result.properties[nestedName] = parseJSONSchemaProperty(
						nestedProp as Record<string, unknown>,
					);
				}
			}
		}
	}

	if (prop.description && typeof prop.description === "string") {
		result.description = prop.description;
	}

	return result;
}

export function parseJSONSchema(
	schema: JSONSchema7,
): Record<string, ParsedSchemaProperty> {
	if (!schema || typeof schema !== "object" || !schema.properties) {
		return {};
	}

	const properties: Record<string, ParsedSchemaProperty> = {};
	for (const [name, prop] of Object.entries(
		schema.properties as Record<string, unknown>,
	)) {
		if (typeof prop === "object" && prop !== null) {
			properties[name] = parseJSONSchemaProperty(
				prop as Record<string, unknown>,
			);
		}
	}

	return properties;
}
