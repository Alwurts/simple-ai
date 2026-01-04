"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export const getProductsKey = () => ["products"];

export const useProducts = () => {
	return useQuery({
		queryKey: getProductsKey(),
		queryFn: async () => {
			const res = await apiClient.api.inventory.products.$get();
			return res.json();
		},
	});
};

export const useCreateProduct = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: { name: string; sku: string; price?: number }) => {
			const res = await apiClient.api.inventory.products.$post({ json: data });
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: getProductsKey() });
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
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: getProductsKey() });
		},
	});
};
