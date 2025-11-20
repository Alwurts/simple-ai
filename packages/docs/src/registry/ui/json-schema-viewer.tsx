"use client";

import type { JSONSchema7 } from "ai";
import type { ComponentProps } from "react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SchemaProperty {
	name: string;
	type: string;
	required: boolean;
	description?: string;
	isArray: boolean;
	enumValues?: string[];
	nested?: SchemaProperty[];
}

interface UnionBranch {
	properties: SchemaProperty[];
	description?: string;
	branchIndex: number;
}

export interface JsonSchemaViewerProps extends ComponentProps<"div"> {
	schema: JSONSchema7;
	title?: string;
}

function parseProperty(
	prop: Record<string, unknown>,
	name: string,
	required: boolean,
): SchemaProperty {
	// Determine property type
	let type: string;
	if (prop.enum) {
		type = "enum";
	} else if (prop.type === "object") {
		type = "object";
	} else if (Array.isArray(prop.type)) {
		type = prop.type[0] || "any";
	} else {
		type = (prop.type as string) || "any";
	}

	const result: SchemaProperty = {
		name,
		type,
		required,
		isArray: false,
	};

	// Handle arrays
	if (prop.type === "array" && prop.items) {
		result.isArray = true;
		const items = prop.items;

		if (typeof items === "object" && !Array.isArray(items)) {
			const itemProp = parseProperty(
				items as Record<string, unknown>,
				"",
				false,
			);
			result.type = itemProp.type;
			result.enumValues = itemProp.enumValues;
			result.nested = itemProp.nested;
		}
	}

	// Handle enums
	if (prop.enum && Array.isArray(prop.enum)) {
		result.type = "enum";
		result.enumValues = prop.enum.map(String);
	}

	// Handle objects
	if (prop.type === "object" && prop.properties) {
		result.nested = [];
		const requiredFields = Array.isArray(prop.required)
			? prop.required
			: [];

		for (const [nestedName, nestedProp] of Object.entries(
			prop.properties,
		)) {
			const isNestedRequired = requiredFields.includes(nestedName);
			result.nested.push(
				parseProperty(nestedProp, nestedName, isNestedRequired),
			);
		}
	}

	// Extract description
	if (prop.description && typeof prop.description === "string") {
		result.description = prop.description;
	}

	return result;
}

function parseSchema(schema: JSONSchema7): {
	isUnion: boolean;
	properties?: SchemaProperty[];
	unions?: UnionBranch[];
} {
	if (!schema || typeof schema !== "object") {
		return { isUnion: false, properties: [] };
	}

	// Handle union schemas (anyOf)
	if (schema.anyOf && Array.isArray(schema.anyOf)) {
		const unions: UnionBranch[] = [];

		schema.anyOf.forEach((branch: unknown, index: number) => {
			if (
				typeof branch === "object" &&
				branch !== null &&
				!Array.isArray(branch)
			) {
				const branchSchema = branch as JSONSchema7;
				const properties: SchemaProperty[] = [];

				if (branchSchema.properties) {
					const requiredFields = Array.isArray(branchSchema.required)
						? branchSchema.required
						: [];

					for (const [name, prop] of Object.entries(
						branchSchema.properties,
					)) {
						const isRequired = requiredFields.includes(name);
						properties.push(
							parseProperty(
								prop as Record<string, unknown>,
								name,
								isRequired,
							),
						);
					}
				}

				unions.push({
					properties,
					description: branchSchema.description,
					branchIndex: index,
				});
			}
		});

		return { isUnion: true, unions };
	}

	// Handle regular schemas
	const properties: SchemaProperty[] = [];
	const requiredFields = Array.isArray(schema.required)
		? schema.required
		: [];

	if (schema.properties) {
		for (const [name, prop] of Object.entries(schema.properties)) {
			const isRequired = requiredFields.includes(name);
			properties.push(
				parseProperty(
					prop as Record<string, unknown>,
					name,
					isRequired,
				),
			);
		}
	}

	return { isUnion: false, properties };
}

function PropertyRow({
	property,
	depth = 0,
}: {
	property: SchemaProperty;
	depth?: number;
}) {
	return (
		<div className="relative">
			<div
				className={cn(
					"flex items-start gap-3 py-2 px-3 text-sm rounded-sm hover:bg-muted/50 transition-colors",
					depth > 0 &&
						"before:absolute before:top-0 before:bottom-0 before:w-px before:bg-border/40 before:left-(--indent-line-left)",
				)}
				style={{
					paddingLeft: `${12 + depth * 16}px`,
					// @ts-expect-error - CSS variables are not typed
					"--indent-line-left":
						depth > 0 ? `${12 + (depth - 1) * 16}px` : undefined,
				}}
			>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1">
						<span className="font-mono font-medium text-foreground">
							{property.name}
						</span>
						{property.required && (
							<span className="text-destructive text-xs font-bold">
								*
							</span>
						)}
						<Badge variant="secondary">
							{property.isArray
								? `${property.type}[]`
								: property.type}
						</Badge>
					</div>
					{property.type === "enum" && property.enumValues && (
						<div className="flex flex-wrap gap-1 mt-2">
							{property.enumValues.map((value) => (
								<Badge
									key={value}
									variant="outline"
									className="text-xs"
								>
									{value}
								</Badge>
							))}
						</div>
					)}
					{property.description && (
						<div className="text-muted-foreground text-xs leading-relaxed">
							{property.description}
						</div>
					)}
				</div>
			</div>
			{property.nested && property.nested.length > 0 && (
				<div>
					{property.nested.map((nestedProp) => (
						<PropertyRow
							key={nestedProp.name}
							property={nestedProp}
							depth={depth + 1}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function UnionBranchView({
	branch,
	isLast,
}: {
	branch: UnionBranch;
	isLast: boolean;
}) {
	return (
		<div className="mb-4">
			<div className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-sm">
				<Badge variant="outline">Option {branch.branchIndex + 1}</Badge>
				{branch.description && (
					<span className="text-sm text-muted-foreground">
						{branch.description}
					</span>
				)}
			</div>

			<div className="mt-1">
				{branch.properties.length === 0 ? (
					<div className="p-4 text-sm text-muted-foreground text-center">
						No properties defined
					</div>
				) : (
					branch.properties.map((property) => (
						<PropertyRow key={property.name} property={property} />
					))
				)}
			</div>

			{!isLast && <Separator className="my-3" />}
		</div>
	);
}

export interface JsonSchemaViewerProps extends ComponentProps<"div"> {
	schema: JSONSchema7;
	title?: string;
	hideHeader?: boolean;
}

export function JsonSchemaViewer({
	schema,
	title = "Schema Structure",
	className,
	hideHeader = false,
	...props
}: JsonSchemaViewerProps) {
	const { isUnion, properties, unions } = useMemo(
		() => parseSchema(schema),
		[schema],
	);

	return (
		<div
			className={cn("border rounded-md overflow-hidden", className)}
			{...props}
		>
			{!hideHeader && (
				<div className="p-3 border-b bg-muted/50">
					<h4 className="text-sm font-semibold">{title}</h4>
					{schema.description && (
						<p className="text-xs text-muted-foreground mt-1">
							{schema.description}
						</p>
					)}
				</div>
			)}
			<div className="max-h-[400px] overflow-y-auto p-2">
				{isUnion ? (
					unions && unions.length > 0 ? (
						unions.map((branch: UnionBranch, index: number) => (
							<UnionBranchView
								key={branch.branchIndex}
								branch={branch}
								isLast={index === unions.length - 1}
							/>
						))
					) : (
						<div className="p-4 text-sm text-muted-foreground text-center">
							No union branches defined
						</div>
					)
				) : properties && properties.length > 0 ? (
					properties.map((property) => (
						<PropertyRow key={property.name} property={property} />
					))
				) : (
					<div className="p-4 text-sm text-muted-foreground text-center">
						No properties defined
					</div>
				)}
			</div>
		</div>
	);
}
