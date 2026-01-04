"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export const getProductsKey = () => ["products"];
export const getProductKey = (id: string) => ["products", id];
export const getProductMovementsKey = (productId: string) => ["products", productId, "movements"];
export const getInventoryMetricsKey = () => ["inventory", "metrics"];

export const useProducts = () => {
	return useQuery({
		queryKey: getProductsKey(),
		queryFn: async () => {
			const res = await apiClient.api.inventory.products.$get();
			return res.json();
		},
	});
};

export const useProduct = (id: string) => {
	return useQuery({
		queryKey: getProductKey(id),
		queryFn: async () => {
			const res = await apiClient.api.inventory.products[":id"].$get({
				param: { id },
			});
			if (!res.ok) {
				throw new Error("Product not found");
			}
			return res.json();
		},
		enabled: !!id,
	});
};

export const useInventoryMetrics = () => {
	return useQuery({
		queryKey: getInventoryMetricsKey(),
		queryFn: async () => {
			const res = await apiClient.api.inventory.metrics.$get();
			return res.json();
		},
	});
};

export const useProductMovements = (productId: string | null) => {
	return useQuery({
		queryKey: getProductMovementsKey(productId ?? ""),
		queryFn: async () => {
			if (!productId) {
				throw new Error("Product ID is required");
			}
			const res = await apiClient.api.inventory.products[":id"].movements.$get({
				param: { id: productId },
			});
			if (!res.ok) {
				throw new Error("Failed to fetch movements");
			}
			return res.json();
		},
		enabled: !!productId,
	});
};

export const useCreateProduct = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: {
			name: string;
			sku: string;
			price?: number;
			description?: string;
			minStockLevel?: number;
		}) => {
			const res = await apiClient.api.inventory.products.$post({ json: data });
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: getProductsKey() });
			queryClient.invalidateQueries({ queryKey: getInventoryMetricsKey() });
		},
	});
};

export const useUpdateProduct = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (params: {
			id: string;
			data: {
				name?: string;
				sku?: string;
				price?: number;
				description?: string;
				minStockLevel?: number;
			};
		}) => {
			const res = await apiClient.api.inventory.products[":id"].$put({
				param: { id: params.id },
				json: params.data,
			});
			if (!res.ok) {
				throw new Error("Failed to update product");
			}
			return res.json();
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: getProductsKey() });
			queryClient.invalidateQueries({ queryKey: getProductKey(variables.id) });
			queryClient.invalidateQueries({ queryKey: getInventoryMetricsKey() });
		},
	});
};

export const useDeleteProduct = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await apiClient.api.inventory.products[":id"].$delete({
				param: { id },
			});
			if (!res.ok) {
				throw new Error("Failed to delete product");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: getProductsKey() });
			queryClient.invalidateQueries({ queryKey: getInventoryMetricsKey() });
		},
	});
};

export const useCreateMovement = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: {
			productId: string;
			type: "IN" | "OUT" | "TRANSFER" | "ADJUSTMENT";
			quantity: number;
			fromWarehouseId?: string;
			toWarehouseId?: string;
			notes?: string;
		}) => {
			const res = await apiClient.api.inventory.movements.$post({ json: data });
			return res.json();
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: getProductsKey() });
			queryClient.invalidateQueries({ queryKey: getInventoryMetricsKey() });
			queryClient.invalidateQueries({
				queryKey: getProductMovementsKey(variables.productId),
			});
		},
	});
};
