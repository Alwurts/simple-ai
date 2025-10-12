import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
			<div className="container mx-auto px-4 py-16">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<Badge variant="secondary" className="mb-4">
						Built on shadcn/ui v4
					</Badge>
					<h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
						Simple AI
					</h1>
					<p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
						A comprehensive component library for building
						AI-powered applications. Built on top of shadcn/ui with
						specialized components for chat interfaces, workflow
						engines, and AI integrations.
					</p>
					<div className="flex gap-4 justify-center">
						<Button size="lg">Get Started</Button>
						<Button variant="outline" size="lg">
							View Components
						</Button>
					</div>
				</div>

				{/* Features Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
					<Card>
						<CardHeader>
							<CardTitle>Chat Components</CardTitle>
							<CardDescription>
								Pre-built chat interfaces with message areas,
								input fields, and streaming support
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
								<li>• Chat Input</li>
								<li>• Chat Message</li>
								<li>• Chat Message Area</li>
								<li>• Markdown Content</li>
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>AI Integrations</CardTitle>
							<CardDescription>
								Seamless integration with popular AI providers
								and SDKs
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
								<li>• OpenAI</li>
								<li>• DeepSeek</li>
								<li>• Groq</li>
								<li>• Model Selector</li>
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Workflow Engine</CardTitle>
							<CardDescription>
								Visual workflow builder with React Flow
								integration
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
								<li>• Flow Nodes</li>
								<li>• Status Edges</li>
								<li>• Editable Handles</li>
								<li>• Resizable Nodes</li>
							</ul>
						</CardContent>
					</Card>
				</div>

				{/* CTA Section */}
				<div className="text-center">
					<h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
						Ready to build AI applications?
					</h2>
					<p className="text-slate-600 dark:text-slate-400 mb-6">
						Start with Simple AI and accelerate your AI development
						workflow.
					</p>
					<Button size="lg">Explore Documentation</Button>
				</div>
			</div>
		</div>
	);
}
