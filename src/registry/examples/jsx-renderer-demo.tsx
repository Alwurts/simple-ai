"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { JsxRenderer } from "@/registry/ui/jsx-renderer";

export default function JsxRendererDemo() {
	const jsxString = `
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					AI Generated UI
					<Badge variant="secondary">Demo</Badge>
				</CardTitle>
				<CardDescription>
					This card was rendered from a JSX string using the JsxRenderer component.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex gap-2">
					<Button size="sm">Primary Action</Button>
					<Button size="sm" variant="outline">Secondary</Button>
				</div>
				<p className="text-sm text-muted-foreground">
					The JsxRenderer allows you to dynamically render JSX strings with full access to your component library.
				</p>
			</CardContent>
		</Card>
	`;

	return (
		<div className="w-full">
			<JsxRenderer
				jsx={jsxString}
				components={{
					Card,
					CardHeader,
					CardTitle,
					CardDescription,
					CardContent,
					Button,
					Badge,
				}}
			/>
		</div>
	);
}
