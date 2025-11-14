"use client";

import { CheckCircle, Circle, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { TodoEditForm } from "@/components/forms/todo-edit-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeleteTodo } from "@/hooks/query/use-todos";
import type { DBTodo } from "@/types/todos";

interface TodoItemProps {
	todo: DBTodo;
}

export function TodoItem({ todo }: TodoItemProps) {
	const [isEditing, setIsEditing] = useState(false);
	const deleteTodo = useDeleteTodo();

	const handleDelete = async () => {
		if (confirm("Are you sure you want to delete this todo?")) {
			try {
				await deleteTodo.mutateAsync(todo.id);
			} catch (error) {
				console.error("Failed to delete todo:", error);
			}
		}
	};

	return (
		<Card className="relative">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg flex items-center gap-2">
						{todo.completed ? (
							<CheckCircle className="w-5 h-5 text-green-500" />
						) : (
							<Circle className="w-5 h-5 text-gray-400" />
						)}
						{todo.title}
					</CardTitle>
					<Badge variant={todo.completed ? "default" : "secondary"}>
						{todo.completed ? "Completed" : "Pending"}
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				{isEditing ? (
					<TodoEditForm
						todoId={todo.id}
						initialData={{
							title: todo.title,
							description: todo.description || "",
							completed: todo.completed,
						}}
						onSuccess={() => setIsEditing(false)}
						onCancel={() => setIsEditing(false)}
					/>
				) : (
					<>
						<p className="text-gray-600 mb-4">{todo.description}</p>
						<div className="flex justify-between items-center">
							<Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
								<Edit2 className="w-4 h-4 mr-1" />
								Edit
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={handleDelete}
								disabled={deleteTodo.isPending}
							>
								<Trash2 className="w-4 h-4 mr-1" />
								Delete
							</Button>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
