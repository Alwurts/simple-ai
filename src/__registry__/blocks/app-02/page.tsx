"use client";

import { experimental_useObject as useObject } from "ai/react";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useTrackEvent } from "@/lib/events";
import { PersonaDisplay } from "@/registry/blocks/app-02/components/persona-display";
import { getRandomExample } from "@/registry/blocks/app-02/lib/example-businesses";
import {
	ProductPersonaSchema,
	UserPersonaSchema,
} from "@/registry/blocks/app-02/types/persona";
import { formSchema } from "@/registry/blocks/app-02/types/persona";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type FormData = z.infer<typeof formSchema>;

export default function PersonaGenerator() {
	const [showDialog, setShowDialog] = useState(false);
	const track = useTrackEvent();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
	});

	const { object, submit, isLoading } = useObject({
		api: "/api/ai/persona",
		schema: z.object({
			userPersona: UserPersonaSchema,
			productPersona: ProductPersonaSchema,
		}),
		onFinish: ({ object }) => {
			track({
				name: "block_used",
				properties: {
					used_block: "app-02",
					used_block_ai_completion: JSON.stringify(object),
				},
			});
		},
	});

	const onSubmit = async (data: FormData) => {
		setShowDialog(true);
		submit(data);
	};

	const handleRandomize = () => {
		const example = getRandomExample();
		reset(example);
	};

	return (
		<div className="max-w-3xl mx-auto p-6 space-y-8">
			<div className="space-y-4 text-center">
				<h1 className="text-3xl font-bold tracking-tight">
					AI Persona Generator
				</h1>
				<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
					Generate detailed user and product personas for your business using
					AI. Fill in the details below or try a random example to get started.
				</p>
			</div>

			<div className="flex justify-end">
				<Button variant="outline" onClick={handleRandomize} className="group">
					<span className="mr-2 group-hover:animate-spin">🎲</span>
					Try Random Example
				</Button>
			</div>

			<div className="bg-card border rounded-lg p-6">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="grid gap-6 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="businessName">Business Name</Label>
							<Input
								id="businessName"
								{...register("businessName")}
								placeholder="Enter your business name"
							/>
							{errors.businessName && (
								<p className="text-sm text-destructive">
									{errors.businessName.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="industry">Industry</Label>
							<Input
								id="industry"
								{...register("industry")}
								placeholder="e.g., Tech, Healthcare, Finance"
							/>
							{errors.industry && (
								<p className="text-sm text-destructive">
									{errors.industry.message}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="targetAudience">Target Audience</Label>
						<p className="text-sm text-muted-foreground">
							Describe your ideal customers including their age, occupation,
							interests, and needs.
						</p>
						<Textarea
							id="targetAudience"
							{...register("targetAudience")}
							placeholder="e.g., Young professionals aged 25-35 working in tech, interested in personal development..."
							className="h-24"
						/>
						{errors.targetAudience && (
							<p className="text-sm text-destructive">
								{errors.targetAudience.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="productDescription">Product Description</Label>
						<p className="text-sm text-muted-foreground">
							Describe what your product or service does and the main problems
							it solves.
						</p>
						<Textarea
							id="productDescription"
							{...register("productDescription")}
							placeholder="e.g., A mobile app that helps users track their daily habits and build better routines..."
							className="h-24"
						/>
						{errors.productDescription && (
							<p className="text-sm text-destructive">
								{errors.productDescription.message}
							</p>
						)}
					</div>

					<Button type="submit" className="w-full">
						Generate Personas
					</Button>
				</form>
			</div>

			<Dialog open={showDialog} onOpenChange={setShowDialog}>
				<DialogContent className="w-[95vw] max-w-4xl lg:max-w-6xl h-[90vh]">
					<ScrollArea className="h-full">
						<PersonaDisplay object={object} isLoading={isLoading} />
					</ScrollArea>
				</DialogContent>
			</Dialog>
		</div>
	);
}
