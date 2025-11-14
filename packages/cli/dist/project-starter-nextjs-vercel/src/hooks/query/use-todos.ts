import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { CreateTodoSchema, UpdateTodoSchema } from "@/types/todos";

const getTodosKey = () => ["todos"];
const getTodoKey = (id: string) => ["todos", id];

export function useTodos() {
	return useQuery({
		queryKey: getTodosKey(),
		queryFn: async () => {
			const response = await apiClient.api.todos.$get();
			const data = await response.json();
			if (!response.ok) {
				throw new Error("Failed to fetch todos");
			}
			if ("error" in data) {
				throw new Error("No data received");
			}
			return data;
		},
	});
}

export function useTodo(id: string) {
	return useQuery({
		queryKey: getTodoKey(id),
		queryFn: async () => {
			const response = await apiClient.api.todos[":todoId"].$get({
				param: { todoId: id },
			});
			const data = await response.json();
			if (!response.ok) {
				throw new Error("Failed to fetch todo");
			}
			if ("error" in data) {
				throw new Error("No data received");
			}
			return data;
		},
		enabled: !!id,
	});
}

export function useCreateTodo() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (todo: CreateTodoSchema) => apiClient.api.todos.$post({ json: todo }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: getTodosKey() });
		},
	});
}

export function useUpdateTodo() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, updates }: { id: string; updates: UpdateTodoSchema }) =>
			apiClient.api.todos[":todoId"].$put({
				param: { todoId: id },
				json: updates,
			}),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: getTodosKey() });
			queryClient.invalidateQueries({ queryKey: getTodoKey(id) });
		},
	});
}

export function useDeleteTodo() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => apiClient.api.todos[":todoId"].$delete({ param: { todoId: id } }),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: getTodosKey() });
			queryClient.removeQueries({ queryKey: getTodoKey(id) });
		},
	});
}
