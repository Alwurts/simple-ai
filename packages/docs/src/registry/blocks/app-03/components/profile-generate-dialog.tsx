"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
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

				<form
					id="user-persona-demo-form"
					onSubmit={form.handleSubmit(values => {
						onSubmit(values);
						setDialogOpen(false);
					})}
					className="space-y-4"
				>
					<FieldGroup>
						<Controller
							name="displayName"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="user-persona-demo-displayName">
										Display Name
									</FieldLabel>
									<Input
										{...field}
										id="user-persona-demo-displayName"
										aria-invalid={fieldState.invalid}
										placeholder="John Doe"
										autoComplete="off"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="username"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="user-persona-demo-username">
										Username
									</FieldLabel>
									<Input
										{...field}
										id="user-persona-demo-username"
										aria-invalid={fieldState.invalid}
										placeholder="johndoe"
										autoComplete="off"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="aboutYou"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="user-persona-demo-aboutYou">
										About You
									</FieldLabel>
									<Textarea
										{...field}
										id="user-persona-demo-aboutYou"
										aria-invalid={fieldState.invalid}
										placeholder="Tell us about yourself..."
										className="resize-none"
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="generationType"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="user-persona-demo-generationType">
										Generation Type
									</FieldLabel>

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
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</FieldGroup>
					<Field orientation="horizontal">
						<Button type="submit">Generate</Button>
					</Field>
				</form>
			</DialogContent>
		</Dialog>
	);
}
