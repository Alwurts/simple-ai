"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { WarehouseForm, type WarehouseFormValues } from "@/components/inventory/warehouse-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateWarehouse } from "@/hooks/query/use-inventory";

export function CreateWarehouseDialog() {
	const [open, setOpen] = useState(false);
	const createWarehouse = useCreateWarehouse();

	const onSubmit = async (data: WarehouseFormValues) => {
		await createWarehouse.mutateAsync(data);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm">
					<Plus className="mr-2 h-4 w-4" /> Add Warehouse
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Warehouse</DialogTitle>
					<DialogDescription>Add a new storage location for your inventory.</DialogDescription>
				</DialogHeader>
				<WarehouseForm
					onSubmit={onSubmit}
					onCancel={() => setOpen(false)}
					isLoading={createWarehouse.isPending}
					submitLabel="Create Warehouse"
				/>
			</DialogContent>
		</Dialog>
	);
}
