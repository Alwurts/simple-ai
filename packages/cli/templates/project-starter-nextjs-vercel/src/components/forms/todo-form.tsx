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
import { useCreateTodo } from "@/hooks/query/use-todos";

const todoFormSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	completed: z.boolean(),
});

type TodoFormData = z.infer<typeof todoFormSchema>;

interface TodoFormProps {
	defaultValues?: Partial<TodoFormData>;
	onSuccess?: () => void;
}

export function TodoForm({ defaultValues, onSuccess }: TodoFormProps) {
	const form = useForm<TodoFormData>({
		resolver: zodResolver(todoFormSchema),
		defaultValues: {
			title: "",
			description: "",
			completed: false,
			...defaultValues,
		},
	});

	const createTodoMutation = useCreateTodo();

	const onFormSubmit = async (data: TodoFormData) => {
		try {
			await createTodoMutation.mutateAsync(data);
			form.reset(); // Clear form after successful submission
			onSuccess?.(); // Call onSuccess callback if provided
		} catch (error) {
			console.error("Failed to create todo:", error);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
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
								<Checkbox checked={field.value} onCheckedChange={field.onChange} />
							</FormControl>
							<div className="space-y-1 leading-none">
								<FormLabel>Mark as completed</FormLabel>
							</div>
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={createTodoMutation.isPending} className="w-full">
					{createTodoMutation.isPending ? "Creating..." : "Create Todo"}
				</Button>
			</form>
		</Form>
	);
}
