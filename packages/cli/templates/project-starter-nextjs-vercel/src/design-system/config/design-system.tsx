import type * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define the structure of our component documentation
export type ComponentExample = {
	name: string;
	description?: string;
	render: React.ReactNode;
	code: string;
};

export type DesignSystemComponent = {
	title: string;
	description: string;
	slug: string;
	examples: ComponentExample[];
};

export const designSystemConfig: DesignSystemComponent[] = [
	{
		title: "Button",
		description: "Displays a button or a component that looks like a button.",
		slug: "button",
		examples: [
			{
				name: "Variants",
				description: "Standard variant styles following the design tokens.",
				render: (
					<div className="flex flex-wrap gap-2">
						<Button variant="default">Default</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="outline">Outline</Button>
						<Button variant="ghost">Ghost</Button>
						<Button variant="destructive">Destructive</Button>
						<Button variant="link">Link</Button>
					</div>
				),
				code: `<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>`,
			},
			{
				name: "Sizes",
				description: "Buttons come in multiple sizes for different contexts.",
				render: (
					<div className="flex flex-wrap items-center gap-2">
						<Button size="sm">Small</Button>
						<Button size="default">Default</Button>
						<Button size="lg">Large</Button>
						<Button size="icon" variant="outline">
							h
						</Button>
					</div>
				),
				code: `<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon" variant="outline"><Icon /></Button>`,
			},
		],
	},
	{
		title: "Card",
		description: "Displays a card with header, content, and footer.",
		slug: "card",
		examples: [
			{
				name: "Simple Card",
				render: (
					<Card className="w-[350px]">
						<CardHeader>
							<CardTitle>Create project</CardTitle>
							<CardDescription>Deploy your new project in one-click.</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid w-full items-center gap-4">
								<div className="flex flex-col space-y-1.5">
									<Label htmlFor="name">Name</Label>
									<Input id="name" placeholder="Name of your project" />
								</div>
							</div>
						</CardContent>
						<CardFooter className="flex justify-between">
							<Button variant="outline">Cancel</Button>
							<Button>Deploy</Button>
						</CardFooter>
					</Card>
				),
				code: `<Card className="w-[350px]">
  <CardHeader>
    <CardTitle>Create project</CardTitle>
    <CardDescription>Deploy your new project in one-click.</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Form Content */}
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Deploy</Button>
  </CardFooter>
</Card>`,
			},
		],
	},
	{
		title: "Inputs & Fields",
		description: "Form controls with label composition patterns.",
		slug: "inputs",
		examples: [
			{
				name: "Default Input",
				render: <Input type="email" placeholder="Email" />,
				code: `<Input type="email" placeholder="Email" />`,
			},
			{
				name: "With Label",
				render: (
					<div className="grid w-full max-w-sm items-center gap-1.5">
						<Label htmlFor="email">Email</Label>
						<Input type="email" id="email" placeholder="Email" />
					</div>
				),
				code: `<div className="grid w-full max-w-sm items-center gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
</div>`,
			},
		],
	},
];
