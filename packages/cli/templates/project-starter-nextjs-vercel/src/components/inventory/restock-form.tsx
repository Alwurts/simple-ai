"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const restockSchema = z.object({
	quantity: z.number().min(1, "Quantity must be at least 1"),
	notes: z.string(),
});

export type RestockFormValues = z.infer<typeof restockSchema>;

interface RestockFormProps {
	onSubmit: (data: RestockFormValues) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export function RestockForm({ onSubmit, onCancel, isLoading }: RestockFormProps) {
	const form = useForm({
		defaultValues: {
			quantity: 1,
			notes: "",
		},
		validators: {
			onSubmit: restockSchema,
			onChange: restockSchema,
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
				<form.Field name="quantity">
					{(field) => {
						const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Quantity</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									type="number"
									min="1"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(Number.parseInt(e.target.value, 10))}
									placeholder="Enter quantity"
									aria-invalid={isInvalid}
								/>
								{isInvalid && (
									<div className="text-sm text-destructive">
										{field.state.meta.errors
											.map((error) => (typeof error === "string" ? error : error?.message))
											.join(", ")}
									</div>
								)}
							</Field>
						);
					}}
				</form.Field>

				<form.Field name="notes">
					{(field) => {
						const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Notes</FieldLabel>
								<Textarea
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Optional notes..."
									className="resize-none"
									aria-invalid={isInvalid}
								/>
								{isInvalid && (
									<div className="text-sm text-destructive">
										{field.state.meta.errors
											.map((error) => (typeof error === "string" ? error : error?.message))
											.join(", ")}
									</div>
								)}
							</Field>
						);
					}}
				</form.Field>

				<div className="flex justify-end gap-2 pt-2">
					<Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
						Cancel
					</Button>
					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Restocking..." : "Restock"}
					</Button>
				</div>
			</FieldGroup>
		</form>
	);
}
