import { agentExecute, agentRoute } from "@/registry/ai/agent-route-respond";

export async function POST(req: Request) {
	const { messages, mentions } = await req.json();
	const agentId = agentRoute(mentions);
	return agentExecute(agentId, messages);
}
