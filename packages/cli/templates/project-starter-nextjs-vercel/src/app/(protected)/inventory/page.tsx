"use client";

import Link from "next/link";
import { useState } from "react";
import {
	AppLayoutHeader,
	AppLayoutHeaderActions,
	AppLayoutPage,
} from "@/components/layout/app-layout";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useCreateMovement, useProducts } from "@/hooks/query/use-inventory";

export default function InventoryPage() {
	const { data: products, isLoading } = useProducts();
	const createMovement = useCreateMovement();
	const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
	const [quantity, setQuantity] = useState("");

	const handleRestock = () => {
		if (selectedProduct && quantity) {
			createMovement.mutate({
				productId: selectedProduct,
				type: "IN",
				quantity: parseInt(quantity, 10),
			});
			setSelectedProduct(null);
			setQuantity("");
		}
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
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>SKU</TableHead>
								<TableHead>Stock Level</TableHead>
								<TableHead>Price</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{products?.map((product) => (
								<TableRow key={product.id}>
									<TableCell>{product.name}</TableCell>
									<TableCell>{product.sku}</TableCell>
									<TableCell>{product.totalStock}</TableCell>
									<TableCell>${product.price}</TableCell>
									<TableCell>
										<Dialog>
											<DialogTrigger asChild>
												<Button
													variant="outline"
													size="sm"
													onClick={() => setSelectedProduct(product.id)}
												>
													Restock
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Restock {product.name}</DialogTitle>
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
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
		</AppLayoutPage>
	);
}
