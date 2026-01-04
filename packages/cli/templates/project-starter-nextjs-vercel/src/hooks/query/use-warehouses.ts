"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export const getWarehousesKey = () => ["warehouses"];
export const getWarehouseKey = (id: string) => ["warehouses", id];

export const useWarehouses = () => {
	return useQuery({
		queryKey: getWarehousesKey(),
		queryFn: async () => {
			const res = await apiClient.api.inventory.warehouses.$get();
			return res.json();
		},
	});
};

export const useWarehouse = (id: string) => {
	return useQuery({
		queryKey: getWarehouseKey(id),
		queryFn: async () => {
			const res = await apiClient.api.inventory.warehouses[":id"].$get({
				param: { id },
			});
			if (!res.ok) {
				throw new Error("Warehouse not found");
			}
			return res.json();
		},
		enabled: !!id,
	});
};

export const useCreateWarehouse = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: { name: string; location?: string; isDefault?: boolean }) => {
			const res = await apiClient.api.inventory.warehouses.$post({
				json: {
					name: data.name,
					location: data.location ?? "",
					isDefault: data.isDefault ?? false,
				},
			});
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: getWarehousesKey() });
		},
	});
};

export const useUpdateWarehouse = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (params: {
			id: string;
			data: {
				name?: string;
				location?: string;
				isDefault?: boolean;
			};
		}) => {
			const res = await apiClient.api.inventory.warehouses[":id"].$put({
				param: { id: params.id },
				json: params.data,
			});
			if (!res.ok) {
				throw new Error("Failed to update warehouse");
			}
			return res.json();
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: getWarehousesKey() });
			queryClient.invalidateQueries({ queryKey: getWarehouseKey(variables.id) });
		},
	});
};

export const useDeleteWarehouse = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await apiClient.api.inventory.warehouses[":id"].$delete({
				param: { id },
			});
			if (!res.ok) {
				throw new Error("Failed to delete warehouse");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: getWarehousesKey() });
		},
	});
};
