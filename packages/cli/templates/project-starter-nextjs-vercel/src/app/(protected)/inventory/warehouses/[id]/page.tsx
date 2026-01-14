"use client";

import { ArrowLeft, MapPin, Pencil, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { WarehouseForm, type WarehouseFormValues } from "@/components/inventory/warehouse-form";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeleteWarehouse, useUpdateWarehouse, useWarehouse } from "@/hooks/query/use-warehouses";
import { AppBreadcrumbs } from "@/ui-registry/registry/ui/app-breadcrumbs";
import {
	AppLayoutHeader,
	AppLayoutHeaderActions,
	AppLayoutPage,
} from "@/ui-registry/registry/ui/app-layout";

export default function WarehouseDetailPage() {
	const [isEditing, setIsEditing] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const params = useParams();
	const router = useRouter();
	const warehouseId = params.id as string;

	const { data: warehouse, isLoading: isLoadingWarehouse } = useWarehouse(warehouseId);
	const updateWarehouse = useUpdateWarehouse();
	const deleteWarehouse = useDeleteWarehouse();

	const handleUpdate = async (data: WarehouseFormValues) => {
		await updateWarehouse.mutateAsync({
			id: warehouseId,
			data,
		});
		setIsEditing(false);
	};

	const handleDelete = async () => {
		await deleteWarehouse.mutateAsync(warehouseId);
		router.push("/inventory/warehouses");
	};

	if (isLoadingWarehouse) {
		return (
			<AppLayoutPage>
				<div className="flex h-full items-center justify-center">
					<p className="text-muted-foreground animate-pulse">Loading warehouse details...</p>
				</div>
			</AppLayoutPage>
		);
	}

	if (!warehouse) {
		return (
			<AppLayoutPage>
				<div className="flex h-full flex-col items-center justify-center gap-4">
					<p className="text-xl font-medium">Warehouse not found</p>
					<Button asChild variant="outline">
						<Link href="/inventory/warehouses">
							<ArrowLeft className="mr-2 h-4 w-4" /> Back to Warehouses
						</Link>
					</Button>
				</div>
			</AppLayoutPage>
		);
	}

	return (
		<AppLayoutPage>
			<AppLayoutHeader>
				<AppBreadcrumbs
					items={[
						{ title: "Inventory", href: "/inventory" },
						{ title: "Warehouses", href: "/inventory/warehouses" },
						{ title: warehouse.name },
					]}
				/>
				<AppLayoutHeaderActions>
					{!isEditing && (
						<>
							<Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
								<Pencil className="mr-2 h-4 w-4" /> Edit
							</Button>
							{!warehouse.isDefault && (
								<Button
									variant="outline"
									size="sm"
									className="text-destructive hover:text-destructive hover:bg-destructive/10"
									onClick={() => setIsDeleteDialogOpen(true)}
								>
									<Trash2 className="mr-2 h-4 w-4" /> Delete
								</Button>
							)}
						</>
					)}
				</AppLayoutHeaderActions>
			</AppLayoutHeader>

			<div className="p-6 space-y-6">
				<div className="flex items-center gap-4">
					<Button asChild variant="ghost" size="sm" className="-ml-2">
						<Link href="/inventory/warehouses">
							<ArrowLeft className="h-4 w-4 mr-1" /> Back
						</Link>
					</Button>
				</div>

				{isEditing ? (
					<Card className="max-w-2xl mx-auto shadow-md">
						<CardHeader>
							<CardTitle>Edit Warehouse</CardTitle>
							<CardDescription>
								Update the details for <strong>{warehouse.name}</strong>.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<WarehouseForm
								onSubmit={handleUpdate}
								onCancel={() => setIsEditing(false)}
								isLoading={updateWarehouse.isPending}
								defaultValues={{
									name: warehouse.name,
									location: warehouse.location ?? "",
									isDefault: warehouse.isDefault,
								}}
								submitLabel="Update Warehouse"
							/>
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-6 md:grid-cols-3">
						<Card className="md:col-span-2 shadow-sm transition-all hover:shadow-md">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<CardTitle className="text-2xl">{warehouse.name}</CardTitle>
											{warehouse.isDefault && (
												<Badge
													variant="secondary"
													className="bg-primary/10 text-primary flex items-center gap-1 py-0.5"
												>
													<Star className="h-3 w-3 fill-primary" /> Primary Warehouse
												</Badge>
											)}
										</div>
										<CardDescription className="flex items-center gap-1">
											<MapPin className="h-3 w-3" /> {warehouse.location || "No location set"}
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="grid grid-cols-2 gap-4 text-sm">
										<div className="space-y-1">
											<p className="text-muted-foreground">Created At</p>
											<p className="font-medium">
												{new Date(warehouse.createdAt).toLocaleDateString()}
											</p>
										</div>
										<div className="space-y-1">
											<p className="text-muted-foreground">Warehouse ID</p>
											<code className="bg-muted px-1.5 py-0.5 rounded text-xs">{warehouse.id}</code>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="h-fit shadow-sm">
							<CardHeader>
								<CardTitle className="text-lg">Stats</CardTitle>
								<CardDescription>Quick overview of contents</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-2 text-sm">
									<p className="text-muted-foreground italic">
										Product distribution and stock levels coming soon...
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				)}
			</div>

			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the warehouse <strong>{warehouse.name}</strong>. This
							action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={deleteWarehouse.isPending}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							disabled={deleteWarehouse.isPending}
						>
							{deleteWarehouse.isPending ? "Deleting..." : "Delete Warehouse"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</AppLayoutPage>
	);
}
