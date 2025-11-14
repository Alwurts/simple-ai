import { ChainWorkflow } from "@/components/agents/workflows/chain-workflow";
import { OrchestratorWorkflow } from "@/components/agents/workflows/orchestrator-workflow";
import { ParallelizationWorkflow } from "@/components/agents/workflows/parallelization-workflow";
import { RoutingWorkflow } from "@/components/agents/workflows/routing-workflow";
import { BlockDisplay } from "@/components/blocks/block-display";

export default async function BlocksPage() {
	return (
		<>
			<div className="flex-1">
				<div className="container-wrapper">
					<div className="container flex items-center py-4">
						<p>
							Each workflow below is fully customizable and copy-paste ready.
							Simply use the shadcn CLI to copy the code directly into your
							project. All examples are built with TypeScript.
						</p>
					</div>
				</div>
			</div>
			<div className="container-wrapper flex-1">
				<div className="container py-8 first:pt-6 last:border-b-0 xl:py-12 space-y-10">
					<div className="flex flex-col items-stretch xl:flex-row px-2 gap-8">
						<div className="w-full max-w-[60ch] xl:min-w-[60ch] xl:flex-1">
							<h1 className="text-2xl font-bold mb-4">Chain Workflow</h1>
							<p className="text-muted-foreground mb-2">
								The Chain Workflow handles tasks by breaking them into ordered
								steps, where each step depends on the previous one. Each step
								can verify the work done before and determine what happens next.
							</p>
							<p className="text-muted-foreground">
								The example below demonstrates this by taking an article,
								creating a summary, checking if the summary matches the original
								text, and then turning approved summaries into social media
								posts.
							</p>
							<div className="mt-4">
								<h3 className="font-semibold mb-2">Perfect for:</h3>
								<ul className="text-muted-foreground list-disc list-inside">
									<li>Multi-step content creation</li>
									<li>Processes that need quality checks</li>
									<li>Content transformation pipelines</li>
								</ul>
							</div>
						</div>
						<ChainWorkflow className="border border-border w-full h-fit" />
					</div>
					<BlockDisplay name={"flow-chain"} />
				</div>
				<div className="container border-b py-8 first:pt-6 last:border-b-0 xl:py-12 space-y-10">
					<div className="flex flex-col items-stretch xl:flex-row px-2 gap-8">
						<div className="w-full max-w-[60ch] xl:min-w-[60ch] xl:flex-1">
							<h1 className="text-2xl font-bold mb-4">Routing Workflow</h1>
							<p className="text-muted-foreground mb-2">
								The Routing Workflow directs incoming requests to the most
								suitable process based on what needs to be done.
							</p>
							<p className="text-muted-foreground">
								In the example below, when a content creation request comes in,
								it gets analyzed to determine if it's for blog content, social
								media content, or SEO content. Based on this analysis, the
								request gets forwarded to one of three specialized agents: a
								blog writing expert, a social media content creator, or an SEO
								specialist. Each expert then processes the request according to
								their specialty.
							</p>
							<div className="mt-4">
								<h3 className="font-semibold mb-2">Perfect for:</h3>
								<ul className="text-muted-foreground list-disc list-inside">
									<li>Content classification systems</li>
									<li>Support request handling</li>
									<li>Multi-path processing</li>
								</ul>
							</div>
						</div>
						<RoutingWorkflow className="border border-border w-full h-fit" />
					</div>
					<BlockDisplay name={"flow-routing"} />
				</div>
				<div className="container border-b py-8 first:pt-6 last:border-b-0 xl:py-12 space-y-10">
					<div className="flex flex-col items-stretch xl:flex-row px-2 gap-8">
						<div className="w-full max-w-[60ch] xl:min-w-[60ch] xl:flex-1">
							<h1 className="text-2xl font-bold mb-4">
								Parallelization Workflow
							</h1>
							<p className="text-muted-foreground mb-2">
								The Parallelization Workflow handles multiple tasks at the same
								time instead of one by one. At the end, we can optionally
								aggregate the results with another agent.
							</p>
							<p className="text-muted-foreground">
								In the example below, we show a workflow for creating exams.
								When someone requests an exam, the input goes to three different
								agents simultaneously: one creates multiple choice questions,
								another makes short answer questions, and the third develops
								essay questions. Their work happens in parallel, and then a
								final agent combines everything into a complete, well-structured
								exam.
							</p>
							<div className="mt-4">
								<h3 className="font-semibold mb-2">Perfect for:</h3>
								<ul className="text-muted-foreground list-disc list-inside">
									<li>Parallel data processing</li>
									<li>Multi-perspective analysis</li>
									<li>High-speed task processing</li>
								</ul>
							</div>
						</div>
						<ParallelizationWorkflow className="border border-border w-full h-fit" />
					</div>
					<BlockDisplay name={"flow-parallelization"} />
				</div>
				<div className="container border-b py-8 first:pt-6 last:border-b-0 xl:py-12 space-y-10">
					<div className="flex flex-col items-stretch xl:flex-row px-2 gap-8">
						<div className="w-full max-w-[60ch] xl:min-w-[60ch] xl:flex-1">
							<h1 className="text-2xl font-bold mb-4">
								Orchestrator-Workers Workflow
							</h1>
							<p className="text-muted-foreground mb-2">
								The Orchestrator-workers Workflow uses a coordinator to
								distribute tasks to specialists based on the user request.
							</p>
							<p className="text-muted-foreground">
								The example below shows a product development process where a
								product manager handles technical feature requests. The manager
								analyzes if the work needs front-end, back-end, or database
								development, and assigns tasks accordingly. A senior developer
								then reviews and combines all the code into a final solution.
							</p>
							<div className="mt-4">
								<h3 className="font-semibold mb-2">Perfect for:</h3>
								<ul className="text-muted-foreground list-disc list-inside">
									<li>Complex task management</li>
									<li>Flexible work distribution</li>
									<li>Coordinated processing</li>
								</ul>
							</div>
						</div>
						<OrchestratorWorkflow className="border border-border w-full h-fit" />
					</div>
					<BlockDisplay name={"flow-orchestrator"} />
				</div>
			</div>
		</>
	);
}
