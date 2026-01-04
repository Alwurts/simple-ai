"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MapPin, MoreHorizontal, Star } from "lucide-react";
import Link from "next/link";
import { CreateWarehouseDialog } from "@/components/inventory/create-warehouse-dialog";
import { AppBreadcrumbs } from "@/components/layout/app-breadcrumbs";
import {
	AppLayoutHeader,
	AppLayoutHeaderActions,
	AppLayoutPage,
} from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWarehouses } from "@/hooks/query/use-warehouses";
import type { Warehouse } from "@/types/warehouses";

export default function WarehousesPage() {
	const { data: warehouses, isLoading } = useWarehouses();

	const columns: ColumnDef<Warehouse>[] = [
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
				const warehouse = row.original;
				return (
					<div className="flex items-center gap-2">
						<Link
							href={`/inventory/warehouses/${warehouse.id}`}
							className="font-medium hover:underline hover:text-primary transition-colors"
						>
							{warehouse.name}
						</Link>
						{warehouse.isDefault && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
					</div>
				);
			},
		},
		{
			accessorKey: "location",
			header: "Location",
			cell: ({ row }) => {
				const location = row.getValue("location") as string;
				return (
					<div className="flex items-center gap-1 text-muted-foreground">
						<MapPin className="h-3 w-3" />
						<span className="text-sm">{location || "N/A"}</span>
					</div>
				);
			},
		},
		{
			accessorKey: "isDefault",
			header: "Status",
			cell: ({ row }) => {
				const isDefault = row.getValue("isDefault") as boolean;
				return isDefault ? (
					<Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
						Primary
					</Badge>
				) : (
					<Badge variant="outline">Regular</Badge>
				);
			},
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const warehouse = row.original;

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
							<DropdownMenuItem onClick={() => navigator.clipboard.writeText(warehouse.id)}>
								Copy warehouse ID
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link href={`/inventory/warehouses/${warehouse.id}`}>Edit Details</Link>
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
				<AppBreadcrumbs
					items={[{ title: "Inventory", href: "/inventory" }, { title: "Warehouses" }]}
				/>
				<AppLayoutHeaderActions>
					<CreateWarehouseDialog />
				</AppLayoutHeaderActions>
			</AppLayoutHeader>

			<div className="p-6 space-y-4">
				{isLoading ? (
					<div className="flex h-40 items-center justify-center text-muted-foreground">
						Loading warehouses...
					</div>
				) : (
					<DataTable columns={columns} data={warehouses || []} />
				)}
			</div>
		</AppLayoutPage>
	);
}
