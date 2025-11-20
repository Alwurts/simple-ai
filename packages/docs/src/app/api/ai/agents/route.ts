import { agentExecute, agentRoute } from "@/registry/ai/agent-route-respond";
import { agents } from "@/registry/ai/agents/registry-full";

export async function POST(req: Request) {
	const { messages, mentions } = await req.json();
	const agentId = agentRoute(mentions);
	const agent = agents[agentId];
	return agentExecute({ agentId, agent, messages });
}
