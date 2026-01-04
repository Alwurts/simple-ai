"use client";

import { useForm } from "@tanstack/react-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { productFormSchema } from "@/types/products";

export type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
	defaultValues?: Partial<ProductFormValues>;
	onSubmit: (data: ProductFormValues) => void;
	isLoading?: boolean;
	submitLabel?: string;
}

export function ProductForm({
	defaultValues,
	onSubmit,
	isLoading,
	submitLabel = "Save Product",
}: ProductFormProps) {
	const initialValues: ProductFormValues = {
		name: defaultValues?.name ?? "",
		sku: defaultValues?.sku ?? "",
		price: defaultValues?.price ?? 0,
		minStockLevel: defaultValues?.minStockLevel ?? 5,
		description: defaultValues?.description ?? null,
	};

	const form = useForm({
		defaultValues: initialValues,

		validators: {
			onSubmit: productFormSchema,
			onChange: productFormSchema,
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
				<div className="grid grid-cols-2 gap-4">
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
										placeholder="Product Name"
										aria-invalid={isInvalid}
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>

					<form.Field name="sku">
						{(field) => {
							const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>SKU</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="PROD-001"
										aria-invalid={isInvalid}
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<form.Field name="price">
						{(field) => {
							const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>Price</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										type="number"
										step="0.01"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(Number.parseFloat(e.target.value))}
										aria-invalid={isInvalid}
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>

					<form.Field name="minStockLevel">
						{(field) => {
							const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>Low Stock Alert</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										type="number"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(Number.parseInt(e.target.value, 10))}
										aria-invalid={isInvalid}
									/>
									<FieldDescription>Alert when stock falls below this.</FieldDescription>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>
				</div>

				<form.Field name="description">
					{(field) => {
						const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Description</FieldLabel>
								<Textarea
									id={field.name}
									name={field.name}
									value={field.state.value || ""}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Product details..."
									className="resize-none"
									aria-invalid={isInvalid}
								/>

								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>

				<div className="flex justify-end pt-2">
					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Saving..." : submitLabel}
					</Button>
				</div>
			</FieldGroup>
		</form>
	);
}
