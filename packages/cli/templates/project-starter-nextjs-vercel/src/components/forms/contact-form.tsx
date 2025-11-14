"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContact } from "@/hooks/query/use-contact";

const contactFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Please enter a valid email address"),
	message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
	isLoading?: boolean;
}

export function ContactForm({ isLoading = false }: ContactFormProps) {
	const form = useForm<ContactFormValues>({
		resolver: zodResolver(contactFormSchema),
	});

	const contactMutation = useContact();

	const onFormSubmit = async (data: ContactFormValues) => {
		try {
			await contactMutation.mutateAsync(data);
			form.reset(); // Clear form after successful submission
		} catch (error) {
			console.error("Failed to submit contact form:", error);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Enter your name" {...field} />
							</FormControl>
							<FormDescription>This is your public display name.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="email" placeholder="Enter your email address" {...field} />
							</FormControl>
							<FormDescription>We'll never share your email with anyone else.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="message"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Message</FormLabel>
							<FormControl>
								<Textarea placeholder="Enter your message" className="resize-none" {...field} />
							</FormControl>
							<FormDescription>Please provide details about your inquiry.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isLoading} className="w-full">
					{isLoading ? "Sending..." : "Send Message"}
				</Button>
			</form>
		</Form>
	);
}
