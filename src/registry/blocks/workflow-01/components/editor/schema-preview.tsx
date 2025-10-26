import type { JSONSchema7 } from "ai";
import { cn } from "@/lib/utils";
import {
	type ParsedSchemaProperty,
	parseJSONSchema,
} from "@/registry/blocks/workflow-01/lib/workflow/json-schema-utils";

interface SchemaPreviewProps {
	schema: JSONSchema7;
}

interface SchemaProperty {
	name: string;
	type: string;
	isArray: boolean;
	isRequired: boolean;
	description?: string;
	properties?: SchemaProperty[];
	enumValues?: string[];
}

function parseSchemaToPreview(schema: JSONSchema7): SchemaProperty[] {
	const parsedProperties = parseJSONSchema(schema);
	const required = Array.isArray(schema.required) ? schema.required : [];

	const convertToSchemaProperty = (
		name: string,
		parsed: ParsedSchemaProperty,
		isRequired: boolean,
	): SchemaProperty => {
		const result: SchemaProperty = {
			name,
			type: parsed.type,
			isArray: parsed.isArray,
			isRequired,
			description: parsed.description,
			properties: undefined,
			enumValues: parsed.enumValues,
		};

		if (parsed.properties) {
			result.properties = [];
			for (const [nestedName, nestedParsed] of Object.entries(
				parsed.properties,
			)) {
				result.properties.push(
					convertToSchemaProperty(nestedName, nestedParsed, false),
				);
			}
		}

		return result;
	};

	const properties: SchemaProperty[] = [];
	for (const [name, parsed] of Object.entries(parsedProperties)) {
		properties.push(
			convertToSchemaProperty(name, parsed, required.includes(name)),
		);
	}

	return properties;
}

function SchemaPropertyRow({
	property,
	level = 0,
}: {
	property: SchemaProperty;
	level?: number;
}) {
	const typeDisplay = property.isArray ? `${property.type}[]` : property.type;

	return (
		<div>
			<div
				className="flex items-start gap-2 px-3 py-2 text-xs rounded-sm"
				style={{ paddingLeft: `${8 + level * 16}px` }}
			>
				<div className="flex-1 text-left min-w-0">
					<div className="flex items-center gap-2">
						<span className="font-mono font-semibold">
							{property.name}
						</span>
						{property.isRequired && (
							<span className="text-red-500 text-[10px]">*</span>
						)}
					</div>
					{property.description && (
						<div className="text-muted-foreground mt-0.5 text-[11px]">
							{property.description}
						</div>
					)}
					{property.type === "enum" && property.enumValues && (
						<div className="text-muted-foreground mt-1 text-[10px]">
							Values: {property.enumValues.join(", ")}
						</div>
					)}
				</div>
				<span
					className={cn(
						"px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0",
						"bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
					)}
				>
					{typeDisplay}
				</span>
			</div>
			{property.properties && property.properties.length > 0 && (
				<div>
					{property.properties.map((nestedProp) => (
						<SchemaPropertyRow
							key={nestedProp.name}
							property={nestedProp}
							level={level + 1}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export function SchemaPreview({ schema }: SchemaPreviewProps) {
	const properties = parseSchemaToPreview(schema);

	if (properties.length === 0) {
		return <SchemaPreviewEmpty />;
	}

	return (
		<div className="border rounded-md overflow-hidden">
			<div className="p-2 border-b bg-muted/50">
				<h4 className="text-xs font-semibold">Schema Structure</h4>
			</div>
			<div className="max-h-[200px] overflow-y-auto p-1">
				{properties.map((property) => (
					<SchemaPropertyRow
						key={property.name}
						property={property}
					/>
				))}
			</div>
		</div>
	);
}

export function SchemaPreviewEmpty() {
	return (
		<div className="border rounded-md p-4 text-xs text-muted-foreground text-center">
			No schema defined
		</div>
	);
}
