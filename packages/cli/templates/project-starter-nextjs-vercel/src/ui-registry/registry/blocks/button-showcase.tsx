"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate form submission
		await new Promise((resolve) => setTimeout(resolve, 2000));

		setIsSubmitting(false);
		alert("Form submitted successfully!");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
			<div className="max-w-2xl mx-auto">
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-3xl font-bold">Contact Us</CardTitle>
						<CardDescription className="text-lg">
							We'd love to hear from you. Send us a message and we'll respond as soon as possible.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="firstName">First Name</Label>
									<Input id="firstName" placeholder="John" required />
								</div>
								<div className="space-y-2">
									<Label htmlFor="lastName">Last Name</Label>
									<Input id="lastName" placeholder="Doe" required />
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" placeholder="john@example.com" required />
							</div>

							<div className="space-y-2">
								<Label htmlFor="subject">Subject</Label>
								<Input id="subject" placeholder="How can we help you?" required />
							</div>

							<div className="space-y-2">
								<Label htmlFor="message">Message</Label>
								<Textarea
									id="message"
									placeholder="Tell us more about your inquiry..."
									className="min-h-[120px]"
									required
								/>
							</div>

							<div className="flex gap-4 pt-4">
								<Button type="submit" disabled={isSubmitting} className="flex-1">
									{isSubmitting ? "Sending..." : "Send Message"}
								</Button>
								<Button type="button" variant="outline" className="flex-1">
									Cancel
								</Button>
							</div>
						</form>

						<div className="mt-8 p-4 bg-muted rounded-lg">
							<h3 className="font-semibold mb-2">Button Showcase</h3>
							<p className="text-sm text-muted-foreground mb-4">
								This form demonstrates various button styles and states in a real-world context.
							</p>
							<div className="flex flex-wrap gap-2">
								<Button size="sm">Small</Button>
								<Button size="default">Default</Button>
								<Button size="lg">Large</Button>
								<Button variant="secondary">Secondary</Button>
								<Button variant="outline">Outline</Button>
								<Button variant="ghost">Ghost</Button>
								<Button variant="destructive">Destructive</Button>
								<Button variant="link">Link</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
