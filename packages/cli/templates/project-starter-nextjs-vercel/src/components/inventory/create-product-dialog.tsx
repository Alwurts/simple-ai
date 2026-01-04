"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateProduct } from "@/hooks/query/use-inventory";
import { ProductForm, type ProductFormValues } from "./product-form";

export function CreateProductDialog() {
	const [open, setOpen] = useState(false);
	const createProduct = useCreateProduct();

	const onSubmit = async (data: ProductFormValues) => {
		await createProduct.mutateAsync(data);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Add Product
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Add New Product</DialogTitle>
					<DialogDescription>Create a new product record in your inventory.</DialogDescription>
				</DialogHeader>
				<ProductForm onSubmit={onSubmit} isLoading={createProduct.isPending} />
			</DialogContent>
		</Dialog>
	);
}
