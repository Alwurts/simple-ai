"use client";

import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useWarehouses } from "@/hooks/query/use-warehouses";
import { movementFormSchema } from "@/types/products";
import type { Warehouse } from "@/types/warehouses";

export type MovementFormValues = z.infer<typeof movementFormSchema>;

interface MovementFormProps {
	onSubmit: (data: MovementFormValues) => void;
	onCancel: () => void;
	isLoading?: boolean;
	initialType?: "IN" | "OUT" | "TRANSFER" | "ADJUSTMENT";
}

export function MovementForm({
	onSubmit,
	onCancel,
	isLoading,
	initialType = "IN",
}: MovementFormProps) {
	const { data: warehouses } = useWarehouses();

	const initialValues: MovementFormValues = {
		type: initialType,
		quantity: 1,
		fromWarehouseId: null,
		toWarehouseId: null,
		notes: null,
	};

	const form = useForm({
		defaultValues: initialValues,

		validators: {
			onSubmit: movementFormSchema,
			onChange: movementFormSchema,
		},
		onSubmit: async ({ value }) => {
			onSubmit(value);
		},
	});

	// Set default warehouse if available

	useEffect(() => {
		if (warehouses && warehouses.length > 0) {
			const defaultWh = warehouses.find((w: Warehouse) => w.isDefault) || warehouses[0];
			if (!form.getFieldValue("fromWarehouseId") && !form.getFieldValue("toWarehouseId")) {
				if (initialType === "IN") {
					form.setFieldValue("toWarehouseId", defaultWh.id);
				} else {
					form.setFieldValue("fromWarehouseId", defaultWh.id);
				}
			}
		}
	}, [warehouses, form, initialType]);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<FieldGroup>
				<form.Field name="type">
					{(field) => (
						<Field>
							<FieldLabel>Movement Type</FieldLabel>
							<Select
								value={field.state.value}
								onValueChange={(value) => field.handleChange(value as MovementFormValues["type"])}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="IN">Restock (IN)</SelectItem>
									<SelectItem value="OUT">Remove Stock (OUT)</SelectItem>
									<SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
									<SelectItem value="TRANSFER">Transfer</SelectItem>
								</SelectContent>
							</Select>
						</Field>
					)}
				</form.Field>

				<form.Subscribe selector={(s) => s.values.type}>
					{(type) => {
						const showFromWarehouse =
							type === "OUT" || type === "TRANSFER" || type === "ADJUSTMENT";
						const showToWarehouse = type === "IN" || type === "TRANSFER" || type === "ADJUSTMENT";

						return (
							<>
								{showFromWarehouse && (
									<form.Field name="fromWarehouseId">
										{(field) => {
											const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel>
														{type === "TRANSFER" ? "Source Warehouse" : "Warehouse"}
													</FieldLabel>
													<Select
														value={field.state.value || ""}
														onValueChange={(val) => field.handleChange(val || null)}
													>
														<SelectTrigger>
															<SelectValue placeholder="Select warehouse" />
														</SelectTrigger>
														<SelectContent>
															{warehouses?.map((w: Warehouse) => (
																<SelectItem key={w.id} value={w.id}>
																	{w.name} {w.isDefault ? "(Default)" : ""}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													{isInvalid && <FieldError errors={field.state.meta.errors} />}
												</Field>
											);
										}}
									</form.Field>
								)}

								{showToWarehouse && (
									<form.Field name="toWarehouseId">
										{(field) => {
											const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
											return (
												<Field data-invalid={isInvalid}>
													<FieldLabel>
														{type === "TRANSFER" ? "Destination Warehouse" : "Warehouse"}
													</FieldLabel>
													<Select
														value={field.state.value || ""}
														onValueChange={(val) => field.handleChange(val || null)}
													>
														<SelectTrigger>
															<SelectValue placeholder="Select warehouse" />
														</SelectTrigger>
														<SelectContent>
															{warehouses?.map((w: Warehouse) => (
																<SelectItem key={w.id} value={w.id}>
																	{w.name} {w.isDefault ? "(Default)" : ""}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													{isInvalid && <FieldError errors={field.state.meta.errors} />}
												</Field>
											);
										}}
									</form.Field>
								)}
							</>
						);
					}}
				</form.Subscribe>

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
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>

				<form.Field name="notes">
					{(field) => (
						<Field>
							<FieldLabel htmlFor={field.name}>Notes</FieldLabel>
							<Textarea
								id={field.name}
								name={field.name}
								value={field.state.value || ""}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Optional notes..."
								className="resize-none"
							/>
						</Field>
					)}
				</form.Field>

				<div className="flex justify-end gap-2 pt-2">
					<Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
						Cancel
					</Button>
					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Processing..." : "Confirm Movement"}
					</Button>
				</div>
			</FieldGroup>
		</form>
	);
}
