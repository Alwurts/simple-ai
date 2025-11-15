import { convertToModelMessages } from "ai";
import { AGENTS, type agentId, agents } from "@/registry/ai/agents/agents";
import type { AIUIMessage } from "@/registry/ai/messages";
import { idToReadableText } from "@/registry/lib/id-to-readable-text";

export async function agentRouteAndRespond(
	messages: AIUIMessage[],
	mentions: {
		id: string;
		name: string;
	}[],
) {
	let mentionedAgentId = mentions?.[0]?.id;

	if (!mentionedAgentId) {
		mentionedAgentId = AGENTS[0];
	}

	const agentResponding = agents[mentionedAgentId as agentId];

	const agentStream = agentResponding.stream({
		messages: convertToModelMessages(messages),
	});

	return agentStream.toUIMessageStreamResponse({
		originalMessages: messages,
		sendReasoning: true,
		messageMetadata: ({ part }) => {
			if (part.type === "start") {
				return {
					timestamp: new Date().toISOString(),
					agent: {
						id: mentionedAgentId,
						name: idToReadableText(mentionedAgentId),
					},
				};
			}

			if (part.type === "finish") {
				return {
					outputTokens: part.totalUsage.outputTokens,
				};
			}
		},
	});
}
