import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { CreateItemSchema, UpdateItemSchema } from "@/types/items";

const getItemsKey = () => ["items"];
const getItemKey = (id: string) => ["items", id];

export function useItems() {
	return useQuery({
		queryKey: getItemsKey(),
		queryFn: async () => {
			const response = await apiClient.api.items.$get();
			const data = await response.json();
			if (!response.ok) {
				throw new Error("Failed to fetch items");
			}
			if ("error" in data) {
				throw new Error("No data received");
			}
			return data;
		},
	});
}

export function useItem(id: string) {
	return useQuery({
		queryKey: getItemKey(id),
		queryFn: async () => {
			const response = await apiClient.api.items[":itemId"].$get({
				param: { itemId: id },
			});
			const data = await response.json();
			if (!response.ok) {
				throw new Error("Failed to fetch item");
			}
			if ("error" in data) {
				throw new Error("No data received");
			}
			return data;
		},
		enabled: !!id,
	});
}

export function useCreateItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (item: CreateItemSchema) => apiClient.api.items.$post({ json: item }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: getItemsKey() });
		},
	});
}

export function useUpdateItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, updates }: { id: string; updates: UpdateItemSchema }) =>
			apiClient.api.items[":itemId"].$put({
				param: { itemId: id },
				json: updates,
			}),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: getItemsKey() });
			queryClient.invalidateQueries({ queryKey: getItemKey(id) });
		},
	});
}

export function useDeleteItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => apiClient.api.items[":itemId"].$delete({ param: { itemId: id } }),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: getItemsKey() });
			queryClient.removeQueries({ queryKey: getItemKey(id) });
		},
	});
}
