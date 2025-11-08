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

/**
 * Type definition for CEL custom type registration
 */
export interface CelTypeDefinition {
	typename: string;
	fields: Record<string, string>;
}

/**
 * Result of converting a JSON Schema to CEL declarations
 */
export interface CelSchemaConversion {
	/** Type definitions to register (in dependency order - nested types first) */
	typeDefinitions: CelTypeDefinition[];
	/** Variable declaration: variable name -> CEL type name */
	variableDeclaration: { name: string; type: string };
}

/**
 * Map JSON Schema type to CEL type
 */
function mapJsonTypeToCel(jsonType: string | undefined): string {
	if (!jsonType) {
		return "dyn";
	}

	switch (jsonType) {
		case "integer":
			return "int";
		case "number":
			return "double";
		case "boolean":
			return "bool";
		case "string":
			return "string";
		case "array":
			return "list";
		case "object":
			return "map";
		default:
			return "dyn";
	}
}

/**
 * Recursively build CEL type definitions from a JSON Schema property
 */
function buildCelTypeFromProperty(
	prop: Record<string, unknown>,
	baseTypename: string,
	fieldName: string,
	typeDefinitions: CelTypeDefinition[],
): string {
	const propType = typeof prop.type === "string" ? prop.type : undefined;

	// Handle arrays
	if (propType === "array" && prop.items && typeof prop.items === "object") {
		const items = prop.items as Record<string, unknown>;
		const itemsType =
			typeof items.type === "string" ? items.type : undefined;

		// Array of objects - create nested type
		if (itemsType === "object" && items.properties) {
			const nestedTypename = `${baseTypename}_${fieldName}_item`;
			const nestedFields: Record<string, string> = {};

			for (const [nestedKey, nestedProp] of Object.entries(
				items.properties as Record<string, unknown>,
			)) {
				if (typeof nestedProp === "object" && nestedProp !== null) {
					nestedFields[nestedKey] = buildCelTypeFromProperty(
						nestedProp as Record<string, unknown>,
						nestedTypename,
						nestedKey,
						typeDefinitions,
					);
				}
			}

			// Register the nested type
			typeDefinitions.push({
				typename: nestedTypename,
				fields: nestedFields,
			});

			return `list<${nestedTypename}>`;
		}

		// Array of primitives
		const itemCelType = mapJsonTypeToCel(itemsType);
		return `list<${itemCelType}>`;
	}

	// Handle objects - create nested type
	if (propType === "object" && prop.properties) {
		const nestedTypename = `${baseTypename}_${fieldName}`;
		const nestedFields: Record<string, string> = {};

		for (const [nestedKey, nestedProp] of Object.entries(
			prop.properties as Record<string, unknown>,
		)) {
			if (typeof nestedProp === "object" && nestedProp !== null) {
				nestedFields[nestedKey] = buildCelTypeFromProperty(
					nestedProp as Record<string, unknown>,
					nestedTypename,
					nestedKey,
					typeDefinitions,
				);
			}
		}

		// Register the nested type
		typeDefinitions.push({
			typename: nestedTypename,
			fields: nestedFields,
		});

		return nestedTypename;
	}

	// Handle primitives
	return mapJsonTypeToCel(propType);
}

/**
 * Convert JSON Schema to CEL type declarations with full recursive type support
 * Returns type definitions and variable declaration for registration with CEL Environment
 */
export function convertSchemaToCelDeclarations(
	schema: JSONSchema7,
	basePath = "input",
): CelSchemaConversion {
	const typeDefinitions: CelTypeDefinition[] = [];

	// Base type name (capitalize first letter)
	const baseTypename = basePath.charAt(0).toUpperCase() + basePath.slice(1);

	// Build fields for the root type
	const rootFields: Record<string, string> = {};

	if (schema.properties) {
		for (const [key, prop] of Object.entries(
			schema.properties as Record<string, unknown>,
		)) {
			if (typeof prop === "object" && prop !== null) {
				rootFields[key] = buildCelTypeFromProperty(
					prop as Record<string, unknown>,
					baseTypename,
					key,
					typeDefinitions,
				);
			}
		}
	}

	// Register the root type
	typeDefinitions.push({
		typename: baseTypename,
		fields: rootFields,
	});

	return {
		typeDefinitions,
		variableDeclaration: {
			name: basePath,
			type: baseTypename,
		},
	};
}

/**
 * Compare two JSON schemas to check if they are identical
 * Returns true if schemas match, false otherwise
 */
export function areSchemasIdentical(schemas: JSONSchema7[]): boolean {
	if (schemas.length <= 1) {
		return true;
	}

	const firstSchema = schemas[0];
	if (!firstSchema) {
		return false;
	}

	// Convert all schemas to type definitions for comparison
	const conversions = schemas.map((schema) =>
		convertSchemaToCelDeclarations(schema),
	);

	const firstConversion = conversions[0];
	if (!firstConversion) {
		return false;
	}

	// Compare all conversions against the first one
	for (let i = 1; i < conversions.length; i++) {
		const currentConversion = conversions[i];
		if (!currentConversion) {
			return false;
		}

		// Compare root type fields
		const firstRootType = firstConversion.typeDefinitions.find(
			(t) => t.typename === firstConversion.variableDeclaration.type,
		);
		const currentRootType = currentConversion.typeDefinitions.find(
			(t) => t.typename === currentConversion.variableDeclaration.type,
		);

		if (!firstRootType || !currentRootType) {
			return false;
		}

		// Compare field names and types
		const firstFields = Object.keys(firstRootType.fields).sort();
		const currentFields = Object.keys(currentRootType.fields).sort();

		if (firstFields.length !== currentFields.length) {
			return false;
		}

		for (let j = 0; j < firstFields.length; j++) {
			if (firstFields[j] !== currentFields[j]) {
				return false;
			}
			if (
				firstRootType.fields[firstFields[j]] !==
				currentRootType.fields[currentFields[j]]
			) {
				return false;
			}
		}
	}

	return true;
}
