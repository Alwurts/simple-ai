import Link from "next/link";
import { AppLayoutContent, AppLayoutHeader, AppLayoutPage } from "@/components/layout/app-layout";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LayoutPage() {
	return (
		<AppLayoutPage>
			<AppLayoutHeader>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/">Home</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Layout Demos</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</AppLayoutHeader>
			<AppLayoutContent>
				<div className="space-y-6 h-full p-4">
					<h1 className="text-2xl font-bold">Layout Demos</h1>
					<p className="text-muted-foreground">
						Explore different layout configurations for your app.
					</p>

					<div className="grid gap-4 md:grid-cols-3">
						<Card>
							<CardHeader>
								<CardTitle>Demo 1</CardTitle>
								<CardDescription>Resizable panels with chat in right panel</CardDescription>
							</CardHeader>
							<CardContent>
								<Button asChild className="w-full">
									<Link href="/layout/demo-1">View Demo</Link>
								</Button>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Demo 2</CardTitle>
								<CardDescription>Single content with chat sheet</CardDescription>
							</CardHeader>
							<CardContent>
								<Button asChild className="w-full">
									<Link href="/layout/demo-2">View Demo</Link>
								</Button>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Demo 3</CardTitle>
								<CardDescription>Full page chat interface</CardDescription>
							</CardHeader>
							<CardContent>
								<Button asChild className="w-full">
									<Link href="/layout/demo-3">View Demo</Link>
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</AppLayoutContent>
		</AppLayoutPage>
	);
}
