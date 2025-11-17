import { agentExecute } from "@/registry/ai/agent-route-respond";
import { type agentId, agents } from "@/registry/ai/agents/agents";
import type { AIUIMessage } from "@/registry/ai/messages";

export async function POST(
	req: Request,
	{ params }: { params: { agentId: string } },
) {
	const { messages } = (await req.json()) as { messages: AIUIMessage[] };

	// Validate that the agent exists
	const agentId = params.agentId as agentId;

	const agentResponding = agents[agentId];

	if (!agentResponding) {
		return new Response(JSON.stringify({ error: "Agent not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	return agentExecute(agentId, messages);
}
