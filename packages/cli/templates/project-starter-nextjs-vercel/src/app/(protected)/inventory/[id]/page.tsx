"use client";

import { format } from "date-fns";
import { Box, DollarSign, History, Pencil, Plus, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ProductForm, type ProductFormValues } from "@/components/inventory/product-form";
import { RestockForm, type RestockFormValues } from "@/components/inventory/restock-form";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	useCreateMovement,
	useProduct,
	useProductMovements,
	useUpdateProduct,
} from "@/hooks/query/use-inventory";
import type { DBMovement } from "@/types/inventory";

export default function ProductPage() {
	const [isEditing, setIsEditing] = useState(false);
	const [isRestocking, setIsRestocking] = useState(false);

	const params = useParams();
	const productId = params.id as string;

	// All hooks must be called at the top level
	const { data: product, isLoading: isLoadingProduct } = useProduct(productId || "");
	const { data: movements, isLoading: isLoadingMovements } = useProductMovements(productId || "");
	const updateProduct = useUpdateProduct();
	const createMovement = useCreateMovement();

	// Don't render anything if we don't have a productId yet
	if (!productId) {
		return (
			<AppLayoutPage>
				<div className="flex flex-col items-center justify-center h-full gap-4">
					<h2 className="text-xl font-semibold">Loading...</h2>
				</div>
			</AppLayoutPage>
		);
	}

	const handleUpdate = async (data: ProductFormValues) => {
		await updateProduct.mutateAsync({
			id: productId,
			data,
		});
		setIsEditing(false);
	};

	const handleRestock = async (data: RestockFormValues) => {
		await createMovement.mutateAsync({
			productId,
			type: "IN",
			quantity: data.quantity,
			notes: data.notes || "Manual Restock via Details",
		});
		setIsRestocking(false);
	};

	if (isLoadingProduct) {
		return (
			<AppLayoutPage>
				<AppLayoutHeader>
					<div className="flex items-center gap-2">
						<div className="h-6 w-32 bg-muted animate-pulse rounded" />
					</div>
				</AppLayoutHeader>
				<div className="p-6">
					<div className="h-64 bg-muted/20 animate-pulse rounded-lg" />
				</div>
			</AppLayoutPage>
		);
	}

	if (!product) {
		return (
			<AppLayoutPage>
				<div className="flex flex-col items-center justify-center h-full gap-4">
					<h2 className="text-xl font-semibold">Product not found</h2>
					<Button asChild>
						<Link href="/inventory">Back to Inventory</Link>
					</Button>
				</div>
			</AppLayoutPage>
		);
	}

	return (
		<AppLayoutPage>
			<AppLayoutHeader>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/inventory">Inventory</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{product.name}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<AppLayoutHeaderActions>
					{isEditing ? (
						<Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
							<X className="mr-2 h-4 w-4" /> Cancel
						</Button>
					) : (
						<>
							<Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
								<Pencil className="mr-2 h-4 w-4" /> Edit
							</Button>
							<Button size="sm" onClick={() => setIsRestocking(true)}>
								<Plus className="mr-2 h-4 w-4" /> Restock
							</Button>
						</>
					)}
				</AppLayoutHeaderActions>
			</AppLayoutHeader>

			<div className="p-6 space-y-8 overflow-y-auto">
				{/* Top Stats Cards */}
				<div className="grid gap-4 md:grid-cols-3">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Stock</CardTitle>
							<Box className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{product.totalStock}</div>
							<p className="text-xs text-muted-foreground">
								{product.totalStock <= (product.minStockLevel ?? 5) ? (
									<span className="text-red-500 font-medium">Low Stock Warning</span>
								) : (
									"Healthy Level"
								)}
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Price</CardTitle>
							<DollarSign className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								${Number.parseFloat(product.price || "0").toFixed(2)}
							</div>
							<p className="text-xs text-muted-foreground">Per unit</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
							<DollarSign className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								$
								{(product.totalStock * Number.parseFloat(product.price || "0")).toLocaleString(
									undefined,
									{
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									},
								)}
							</div>
							<p className="text-xs text-muted-foreground">Total asset value</p>
						</CardContent>
					</Card>
				</div>

				<div className="grid gap-8 md:grid-cols-3">
					{/* Main Detail / Edit Area */}
					<div className="md:col-span-2 space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Product Details</CardTitle>
								<CardDescription>Basic information and settings.</CardDescription>
							</CardHeader>
							<CardContent>
								{isEditing ? (
									<ProductForm
										defaultValues={{
											name: product.name,
											sku: product.sku,
											price: product.price ? Number.parseFloat(product.price) : 0,
											description: product.description || "",
											minStockLevel: product.minStockLevel || 5,
										}}
										onSubmit={handleUpdate}
										isLoading={updateProduct.isPending}
										submitLabel="Save Changes"
									/>
								) : (
									<div className="space-y-4">
										<div className="grid grid-cols-2 gap-4">
											<div>
												<h4 className="text-sm font-medium text-muted-foreground">SKU</h4>
												<p className="text-sm font-mono">{product.sku}</p>
											</div>
											<div>
												<h4 className="text-sm font-medium text-muted-foreground">
													Min. Stock Level
												</h4>
												<p className="text-sm">{product.minStockLevel}</p>
											</div>
										</div>
										<Separator />
										<div>
											<h4 className="text-sm font-medium text-muted-foreground mb-1">
												Description
											</h4>
											<p className="text-sm text-foreground/90 leading-relaxed">
												{product.description || "No description provided."}
											</p>
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{/* History Section */}
						<Card>
							<CardHeader>
								<div className="flex items-center gap-2">
									<History className="h-5 w-5 text-muted-foreground" />
									<CardTitle>Movement History</CardTitle>
								</div>
							</CardHeader>
							<CardContent>
								{isLoadingMovements ? (
									<div className="py-4 text-center text-sm text-muted-foreground">
										Loading history...
									</div>
								) : !movements || movements.length === 0 ? (
									<div className="py-8 text-center text-sm text-muted-foreground border border-dashed rounded-lg">
										No movements recorded.
									</div>
								) : (
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Date</TableHead>
												<TableHead>Type</TableHead>
												<TableHead className="text-right">Quantity</TableHead>
												<TableHead className="hidden sm:table-cell">Notes</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{movements?.map((movement: DBMovement) => (
												<TableRow key={movement.id}>
													<TableCell className="whitespace-nowrap">
														{format(new Date(movement.createdAt), "MMM d, yyyy")}
														<div className="text-xs text-muted-foreground">
															{format(new Date(movement.createdAt), "h:mm a")}
														</div>
													</TableCell>
													<TableCell>
														<Badge
															variant="secondary"
															className={
																movement.type === "IN"
																	? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100"
																	: movement.type === "OUT"
																		? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100"
																		: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100"
															}
														>
															{movement.type}
														</Badge>
													</TableCell>
													<TableCell className="text-right font-mono font-medium">
														{movement.type === "OUT" ? "-" : "+"}
														{movement.quantity}
													</TableCell>
													<TableCell className="hidden sm:table-cell text-xs text-muted-foreground max-w-[200px] truncate">
														{movement.notes || "-"}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Sidebar / Meta Info */}
					<div className="space-y-6">
						<Card className="bg-muted/30">
							<CardHeader>
								<CardTitle className="text-sm">Metadata</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4 text-xs">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Created</span>
									<span>{format(new Date(product.createdAt), "PPP")}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Last Updated</span>
									<span>{format(new Date(product.updatedAt), "PPP")}</span>
								</div>
								<Separator />
								<div className="flex justify-between items-center">
									<span className="text-muted-foreground">Product ID</span>
									<code className="bg-background px-1 py-0.5 rounded border">
										{product.id.slice(0, 8)}...
									</code>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			{/* Restock Dialog - Triggered from Header */}
			<Dialog open={isRestocking} onOpenChange={setIsRestocking}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Restock Product</DialogTitle>
						<DialogDescription>
							Add stock to <strong>{product.name}</strong>.
						</DialogDescription>
					</DialogHeader>
					<RestockForm
						onSubmit={handleRestock}
						onCancel={() => setIsRestocking(false)}
						isLoading={createMovement.isPending}
					/>
				</DialogContent>
			</Dialog>
		</AppLayoutPage>
	);
}
