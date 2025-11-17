import { AgentDisplay } from "@/components/agents/agent-display";
import { getAllRegistryItemIds } from "@/lib/registry";

export const dynamic = "force-static";
export const revalidate = false;

export default async function AgentsPage() {
	const agentIds = await getAllRegistryItemIds(["registry:lib"], ["agent"]);

	return (
		<div className="flex flex-col gap-12 md:gap-24">
			{agentIds.map((name) => (
				<AgentDisplay name={name} key={name} />
			))}
		</div>
	);
}
