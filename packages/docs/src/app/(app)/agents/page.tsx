import { AgentDisplay } from "@/components/agents/agent-display";

export const dynamic = "force-static";
export const revalidate = false;

const DISPLAYED_AGENTS = ["firecrawl-agent", "weather-agent"];

export default async function AgentsPage() {
	return (
		<div className="flex flex-col gap-12 md:gap-24">
			{DISPLAYED_AGENTS.map((name) => (
				<AgentDisplay name={name} key={name} />
			))}
		</div>
	);
}
