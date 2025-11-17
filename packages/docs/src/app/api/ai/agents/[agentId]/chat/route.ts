import { agentExecute } from "@/registry/ai/agent-route-respond";
import { type agentId, agents } from "@/registry/ai/agents/agents";
import type { AIUIMessage } from "@/registry/ai/messages";

export async function POST(
	req: Request,
	{ params }: { params: Promise<{ agentId: string }> },
) {
	const { messages } = (await req.json()) as { messages: AIUIMessage[] };

	// Validate that the agent exists
	const { agentId } = await params;
	const agentIdTyped = agentId as agentId;

	const agentResponding = agents[agentIdTyped];

	if (!agentResponding) {
		return new Response(JSON.stringify({ error: "Agent not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	return agentExecute(agentIdTyped, messages);
}
