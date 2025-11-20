import type { Experimental_Agent as Agent } from "ai";
import { convertToModelMessages } from "ai";
import { AGENTS, type agentId } from "@/registry/ai/agents/agents-registry";
import type { AIUIMessage } from "@/registry/ai/messages";
import { idToReadableText } from "@/registry/lib/id-to-readable-text";

export function agentRoute(mentions: { id: string; name: string }[]): agentId {
	let mentionedAgentId = mentions?.[0]?.id;

	if (!mentionedAgentId) {
		mentionedAgentId = AGENTS[0];
	}

	return mentionedAgentId as agentId;
}

export async function agentExecute({
	agentId,
	agent,
	messages,
}: {
	agentId: string;
	// biome-ignore lint/suspicious/noExplicitAny: Agent type is not known
	agent: Agent<any, any, any>;
	messages: AIUIMessage[];
}) {
	const agentStream = agent.stream({
		messages: convertToModelMessages(messages),
	});

	return agentStream.toUIMessageStreamResponse<AIUIMessage>({
		originalMessages: messages,
		sendReasoning: true,
		messageMetadata: ({ part }) => {
			if (part.type === "start") {
				return {
					timestamp: new Date().toISOString(),
					agent: {
						id: agentId,
						name: idToReadableText(agentId),
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
