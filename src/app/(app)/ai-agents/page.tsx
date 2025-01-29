import { ChainWorkflow } from "@/components/agents/workflows/chain-workflow";
import { OrchestratorWorkflow } from "@/components/agents/workflows/orchestrator-workflow";
import { ParallelizationWorkflow } from "@/components/agents/workflows/parallelization-workflow";
import { RoutingWorkflow } from "@/components/agents/workflows/routing-workflow";
import { BlockDisplay } from "@/components/blocks/block-display";

export default async function BlocksPage() {
	return (
		<div>
			<div className="border-grid container border-b py-8 first:pt-6 last:border-b-0 xl:py-12 space-y-10">
				<div className="flex flex-col items-stretch xl:flex-row px-2 gap-8">
					<div className="w-full max-w-[60ch] xl:min-w-[60ch] xl:flex-1">
						<h1 className="text-2xl font-bold mb-4">Chain Workflow</h1>
						<p className="text-muted-foreground">
							The Chain Workflow, also known as Prompt Chaining, is a powerful
							approach where complex tasks are broken down into sequential
							steps, with each step handled by a separate LLM call. This method
							allows for intermediate validation and ensures the process stays
							on track. It's particularly effective when tasks can be clearly
							divided into distinct subtasks, offering improved accuracy through
							step-by-step execution while maintaining control over the process
							flow.
						</p>
					</div>
					<ChainWorkflow className="border border-border w-full h-fit" />
				</div>
				<BlockDisplay name={"flow-chain"} />
			</div>
			<div className="border-grid container border-b py-8 first:pt-6 last:border-b-0 xl:py-12 space-y-10">
				<div className="flex flex-col items-stretch xl:flex-row px-2 gap-8">
					<div className="w-full max-w-[60ch] xl:min-w-[60ch] xl:flex-1">
						<h1 className="text-2xl font-bold mb-4">Routing Workflow</h1>
						<p className="text-muted-foreground">
							The Routing Workflow is a strategic approach where a incoming
							input is classified and directed to specialized processes or
							models best suited to handle it. This workflow enables efficient
							separation of concerns, allowing for more targeted and optimized
							processing of different input types. It's particularly valuable
							when dealing with diverse input categories that require distinct
							handling strategies, ensuring each type receives the most
							appropriate and effective processing.
						</p>
					</div>
					<RoutingWorkflow className="border border-border w-full h-fit" />
				</div>
				<BlockDisplay name={"flow-routing"} />
			</div>
			<div className="border-grid container border-b py-8 first:pt-6 last:border-b-0 xl:py-12 space-y-10">
				<div className="flex flex-col items-stretch xl:flex-row px-2 gap-8">
					<div className="w-full max-w-[60ch] xl:min-w-[60ch] xl:flex-1">
						<h1 className="text-2xl font-bold mb-4">
							Parallelization Workflow
						</h1>
						<p className="text-muted-foreground">
							The Parallelization Workflow enables simultaneous processing of
							tasks.This workflow is particularly effective when tasks can be
							divided into independent components or when multiple perspectives
							are needed for higher confidence results. It allows for focused
							attention on specific aspects of complex tasks through separate
							LLM calls, often leading to better overall performance.
						</p>
					</div>
					<ParallelizationWorkflow className="border border-border w-full h-fit" />
				</div>
				<BlockDisplay name={"flow-parallelization"} />
			</div>
			<div className="border-grid container border-b py-8 first:pt-6 last:border-b-0 xl:py-12 space-y-10">
				<div className="flex flex-col items-stretch xl:flex-row px-2 gap-8">
					<div className="w-full max-w-[60ch] xl:min-w-[60ch] xl:flex-1">
						<h1 className="text-2xl font-bold mb-4">
							Orchestrator-Workers Workflow
						</h1>
						<p className="text-muted-foreground">
							The Orchestrator-Workers Workflow employs a central LLM to
							dynamically analyze and decompose complex tasks, delegate subtasks
							to specialized worker LLMs, and synthesize their results. This
							workflow excels in handling unpredictable tasks where the required
							subtasks and their nature cannot be predetermined. Unlike
							parallelization, the orchestrator determines the necessary
							subtasks based on the specific input, providing greater
							flexibility and adaptability for complex, multi-faceted
							challenges.
						</p>
					</div>
					<OrchestratorWorkflow className="border border-border w-full h-fit" />
				</div>
				<BlockDisplay name={"flow-orchestrator"} />
			</div>
		</div>
	);
}
