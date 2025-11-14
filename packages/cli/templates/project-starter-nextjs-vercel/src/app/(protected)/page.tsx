"use client";

import { Circle, Plus } from "lucide-react";
import { useState } from "react";
import { TodoForm } from "@/components/forms/todo-form";
import { TodoItem } from "@/components/todos/todo-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useTodos } from "@/hooks/query/use-todos";

export default function ProtectedPage() {
	const { data: todos, isLoading, error } = useTodos();

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

	if (isLoading) {
		return (
			<div className="container mx-auto p-6">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">My Todos</h1>
					<Skeleton className="h-10 w-32" />
				</div>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{[...Array(6)].map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Need for skeleton loading
						<Card key={i}>
							<CardHeader>
								<Skeleton className="h-4 w-3/4" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-4 w-full mb-2" />
								<Skeleton className="h-4 w-2/3" />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto p-6">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-600 mb-4">Error loading todos</h1>
					<p className="text-gray-600">Please try again later.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">My Todos</h1>
				<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="w-4 h-4 mr-2" />
							Add Todo
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add New Todo</DialogTitle>
						</DialogHeader>
						<TodoForm onSuccess={() => setIsAddDialogOpen(false)} />
					</DialogContent>
				</Dialog>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{todos?.map(todo => (
					<TodoItem key={todo.id} todo={todo} />
				))}
			</div>

			{todos?.length === 0 && (
				<div className="text-center py-12">
					<Circle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-600 mb-2">No todos yet</h2>
					<p className="text-gray-500">Create your first todo to get started!</p>
				</div>
			)}
		</div>
	);
}
