"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateMovement, useProducts } from "@/hooks/query/use-inventory";
import type { ProductWithStock } from "@/types/inventory";
import { DataTable } from "../../../components/ui/data-table";

const createColumns = (
	onRestock: (productId: string, name: string) => void,
): ColumnDef<ProductWithStock>[] => [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
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
			const name = row.getValue("name") as string;
			return <div className="font-medium">{name}</div>;
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
			const minStock = row.original.minStockLevel ?? 5; // Default to 5 if null
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
			const price = parseFloat(row.getValue("price"));
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
						<DropdownMenuItem onClick={() => onRestock(product.id, product.name)}>
							Restock
						</DropdownMenuItem>
						<DropdownMenuItem>View details</DropdownMenuItem>
						<DropdownMenuItem>Edit product</DropdownMenuItem>
						<DropdownMenuItem>View movements</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

export default function InventoryPage() {
	const { data: products, isLoading } = useProducts();
	const createMovement = useCreateMovement();
	const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
	const [selectedProductName, setSelectedProductName] = useState<string>("");
	const [quantity, setQuantity] = useState("");

	const handleRestock = () => {
		if (selectedProduct && quantity) {
			createMovement.mutate({
				productId: selectedProduct,
				type: "IN",
				quantity: parseInt(quantity, 10),
			});
			setSelectedProduct(null);
			setSelectedProductName("");
			setQuantity("");
		}
	};

	const onRestock = (productId: string, name: string) => {
		setSelectedProduct(productId);
		setSelectedProductName(name);
	};

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
				<AppLayoutHeaderActions>{/* Add product button could be here */}</AppLayoutHeaderActions>
			</AppLayoutHeader>

			<div className="p-6">
				{isLoading ? (
					<div>Loading...</div>
				) : (
					<DataTable columns={createColumns(onRestock)} data={products || []} />
				)}
			</div>

			<Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Restock {selectedProductName}</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="quantity">Quantity</Label>
							<Input
								id="quantity"
								type="number"
								value={quantity}
								onChange={(e) => setQuantity(e.target.value)}
							/>
						</div>
						<Button onClick={handleRestock} disabled={createMovement.isPending}>
							{createMovement.isPending ? "Restocking..." : "Restock"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</AppLayoutPage>
	);
}
