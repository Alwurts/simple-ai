"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateTodo } from "@/hooks/query/use-todos";
import type { DBTodo } from "@/types/todos";

const todoEditFormSchema = z.object({
	title: z.string().min(1, "Title is required").optional(),
	description: z.string().min(1, "Description is required").optional(),
	completed: z.boolean().optional(),
});

type TodoEditFormData = z.infer<typeof todoEditFormSchema>;

interface TodoEditFormProps {
	todoId: string;
	onSuccess?: () => void;
	onCancel?: () => void;
	initialData: Pick<DBTodo, "title" | "description" | "completed">;
}

export function TodoEditForm({ todoId, onSuccess, onCancel, initialData }: TodoEditFormProps) {
	const form = useForm<TodoEditFormData>({
		resolver: zodResolver(todoEditFormSchema),
		defaultValues: {
			...initialData,
			description: initialData.description ?? undefined,
		},
	});

	const updateTodoMutation = useUpdateTodo();

	const onFormSubmit = async (data: TodoEditFormData) => {
		try {
			await updateTodoMutation.mutateAsync({ id: todoId, updates: data });
			onSuccess?.(); // Call onSuccess callback if provided
		} catch (error) {
			console.error("Failed to update todo:", error);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-3">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input placeholder="Enter todo title" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Input placeholder="Enter todo description" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="completed"
					render={({ field }) => (
						<FormItem className="flex flex-row items-start space-x-3 space-y-0">
							<FormControl>
								<Checkbox
									checked={field.value ?? initialData.completed}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<div className="space-y-1 leading-none">
								<FormLabel>Completed</FormLabel>
							</div>
						</FormItem>
					)}
				/>

				<div className="flex gap-2">
					<Button type="submit" disabled={updateTodoMutation.isPending} size="sm">
						{updateTodoMutation.isPending ? "Saving..." : "Save"}
					</Button>
					<Button type="button" variant="outline" size="sm" onClick={onCancel}>
						Cancel
					</Button>
				</div>
			</form>
		</Form>
	);
}
