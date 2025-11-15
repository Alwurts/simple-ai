import { agentRouteAndRespond } from "@/registry/ai/agent-route-respond";

export async function POST(req: Request) {
	const { messages, mentions } = await req.json();
	return agentRouteAndRespond(messages, mentions);
}
