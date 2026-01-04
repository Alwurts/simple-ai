"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CreateProductDialog } from "@/components/inventory/create-product-dialog";
import { MovementForm, type MovementFormValues } from "@/components/inventory/movement-form";
import {
	AppLayoutHeader,
	AppLayoutHeaderActions,
	AppLayoutPage,
} from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useCreateMovement, useProducts } from "@/hooks/query/use-inventory";
import type { Product } from "@/types/inventory";
import { DataTable } from "../../../components/ui/data-table";

export default function InventoryPage() {
	const { data: products, isLoading } = useProducts();
	const createMovement = useCreateMovement();

	// Movement Dialog State
	const [activeMovement, setActiveMovement] = useState<{
		product: Product;
		type: "IN" | "OUT";
	} | null>(null);

	const handleMovementSubmit = async (data: MovementFormValues) => {
		if (activeMovement) {
			await createMovement.mutateAsync({
				productId: activeMovement.product.id,
				type: data.type,
				quantity: data.quantity,
				toWarehouseId: data.type === "IN" ? data.warehouseId : undefined,
				fromWarehouseId: data.type === "OUT" ? data.warehouseId : undefined,
				notes: data.notes || `Manual ${data.type}`,
			});
			setActiveMovement(null);
		}
	};

	const columns: ColumnDef<Product>[] = [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "name",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Name
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const product = row.original;
				return (
					<Link
						href={`/inventory/${product.id}`}
						className="font-medium hover:underline hover:text-primary transition-colors"
					>
						{product.name}
					</Link>
				);
			},
		},
		{
			accessorKey: "sku",
			header: "SKU",
		},
		{
			accessorKey: "totalStock",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Stock Level
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const stock = row.getValue("totalStock") as number;
				const minStock = row.original.minStockLevel ?? 5;
				const isLow = stock <= minStock;

				return (
					<div className="flex items-center gap-2">
						<span>{stock}</span>
						{isLow && (
							<Badge variant="destructive" className="text-xs">
								Low
							</Badge>
						)}
					</div>
				);
			},
		},
		{
			accessorKey: "price",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Price
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const price = Number.parseFloat(row.getValue("price"));
				const formatted = new Intl.NumberFormat("en-US", {
					style: "currency",
					currency: "USD",
				}).format(price);

				return <div className="text-right font-medium">{formatted}</div>;
			},
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const product = row.original;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.id)}>
								Copy product ID
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link href={`/inventory/${product.id}`}>View Details</Link>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setActiveMovement({ product, type: "IN" })}>
								Restock
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setActiveMovement({ product, type: "OUT" })}>
								Remove Stock
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	return (
		<AppLayoutPage>
			<AppLayoutHeader>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/dashboard">Dashboard</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Inventory</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<AppLayoutHeaderActions>
					<CreateProductDialog />
				</AppLayoutHeaderActions>
			</AppLayoutHeader>

			<div className="p-6">
				{isLoading ? (
					<div className="flex h-40 items-center justify-center text-muted-foreground">
						Loading inventory...
					</div>
				) : (
					<DataTable columns={columns} data={products || []} />
				)}
			</div>

			{/* Movement Dialog - Uses TanStack Form */}
			<Dialog open={!!activeMovement} onOpenChange={(open) => !open && setActiveMovement(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{activeMovement?.type === "IN" ? "Restock" : "Remove Stock"}{" "}
							{activeMovement?.product?.name}
						</DialogTitle>
						<DialogDescription>
							{activeMovement?.type === "IN"
								? "Add inventory to a warehouse. This will record an 'IN' movement."
								: "Remove inventory from a warehouse. This will record an 'OUT' movement."}
						</DialogDescription>
					</DialogHeader>
					{activeMovement && (
						<MovementForm
							onSubmit={handleMovementSubmit}
							onCancel={() => setActiveMovement(null)}
							isLoading={createMovement.isPending}
							initialType={activeMovement.type}
						/>
					)}
				</DialogContent>
			</Dialog>
		</AppLayoutPage>
	);
}
