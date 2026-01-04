"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const warehouseSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	location: z.string().optional(),
	isDefault: z.boolean().optional(),
});

export type WarehouseFormValues = z.infer<typeof warehouseSchema>;

interface WarehouseFormProps {
	onSubmit: (data: WarehouseFormValues) => void;
	onCancel?: () => void;
	isLoading?: boolean;
	defaultValues?: Partial<WarehouseFormValues>;
	submitLabel?: string;
}

export function WarehouseForm({
	onSubmit,
	isLoading,
	defaultValues,
	submitLabel = "Save Warehouse",
}: WarehouseFormProps) {
	const form = useForm({
		defaultValues: {
			name: defaultValues?.name || "",
			location: defaultValues?.location || "",
			isDefault: defaultValues?.isDefault || false,
		} as WarehouseFormValues,
		validators: {
			onSubmit: warehouseSchema,
			onChange: warehouseSchema,
		},
		onSubmit: async ({ value }) => {
			onSubmit(value);
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<FieldGroup>
				<form.Field name="name">
					{(field) => {
						const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Name</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Main Warehouse, Storage A, etc."
									aria-invalid={isInvalid}
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>

				<form.Field name="location">
					{(field) => (
						<Field>
							<FieldLabel htmlFor={field.name}>Location</FieldLabel>
							<Input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Address or description..."
							/>
						</Field>
					)}
				</form.Field>

				<form.Field name="isDefault">
					{(field) => (
						<Field
							orientation="horizontal"
							className="items-center justify-between rounded-lg border p-3 shadow-sm"
						>
							<div className="space-y-0.5">
								<FieldLabel className="text-base">Default Warehouse</FieldLabel>
								<p className="text-[0.8rem] text-muted-foreground">
									Set this as the primary warehouse for AI and manual movements.
								</p>
							</div>
							<Switch checked={field.state.value} onCheckedChange={field.handleChange} />
						</Field>
					)}
				</form.Field>

				<div className="flex justify-end gap-2 pt-2">
					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Saving..." : submitLabel}
					</Button>
				</div>
			</FieldGroup>
		</form>
	);
}
