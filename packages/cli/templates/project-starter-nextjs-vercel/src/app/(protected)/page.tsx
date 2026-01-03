import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProtectedPage() {
	return (
		<div className="p-4">
			<Card>
				<CardHeader>
					<CardTitle>Hello World</CardTitle>
					<CardDescription>A simple hello world page using shadcn/ui components.</CardDescription>
				</CardHeader>
				<CardContent>
					<p>Welcome to your protected page!</p>
					<Button className="mt-4">Click Me</Button>
				</CardContent>
			</Card>
		</div>
	);
}
