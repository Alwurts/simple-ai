"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getRandomExample } from "@/registry/blocks/app-03/lib/profile-examples";
import { profileGenerationSchema } from "@/registry/blocks/app-03/lib/x";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

interface ProfileGenerateDialogProps {
	onSubmit: (values: z.infer<typeof profileGenerationSchema>) => void;
}

export function ProfileGenerateDialog({
	onSubmit,
}: ProfileGenerateDialogProps) {
	const [dialogOpen, setDialogOpen] = useState(true);

	const form = useForm<z.infer<typeof profileGenerationSchema>>({
		resolver: zodResolver(profileGenerationSchema),
		defaultValues: {
			displayName: "",
			username: "",
			aboutYou: "",
			generationType: "fun",
		},
	});

	const handleRandomize = () => {
		const example = getRandomExample();
		form.reset(example);
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<button
					type="button"
					className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 font-bold hover:bg-gray-100 dark:hover:bg-zinc-800"
				>
					Generate your X bio
				</button>
			</DialogTrigger>

			<DialogContent className="max-w-[95vw] md:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Generate your X bio</DialogTitle>
				</DialogHeader>

				<Button variant="outline" onClick={handleRandomize} className="group">
					<span className="mr-2 group-hover:animate-spin">🎲</span>
					Try Random Example
				</Button>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((values) => {
							onSubmit(values);
							setDialogOpen(false);
						})}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="displayName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Display Name</FormLabel>
									<FormControl>
										<Input placeholder="John Doe" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input placeholder="johndoe" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="aboutYou"
							render={({ field }) => (
								<FormItem>
									<FormLabel>About You</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Tell us about yourself..."
											className="resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="generationType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Generation Type</FormLabel>
									<FormControl>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger>
												<SelectValue placeholder="Select a generation type" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="fun">🎉 Fun</SelectItem>
												<SelectItem value="professional">
													👨‍💻 Professional
												</SelectItem>
												<SelectItem value="casual">👋 Casual</SelectItem>
												<SelectItem value="technical">💻 Technical</SelectItem>
												<SelectItem value="creative">🎨 Creative</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Generate</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
