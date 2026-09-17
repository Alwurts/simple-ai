"use client";

import { useChat } from "@ai-sdk/react";
import { Container, Text } from "@react-three/uikit";
import { isTextUIPart, isToolUIPart } from "ai";
import { createContext, type ReactNode, useContext, useMemo } from "react";
import { VrChatInput } from "@/components/ui/vr-chat-input";
import { asciiSafe, VrMarkdown } from "@/components/ui/vr-markdown";
import { VrReasoning } from "@/components/ui/vr-reasoning";
import { VrTool } from "@/components/ui/vr-tool";
import { VrWorked } from "@/components/ui/vr-worked";
import { splitWorkedParts } from "@/components/ui/worked";
import { useWorldTheme } from "@/components/ui/world-card";
import {
  type CardChatMessage,
  chatTransport,
  initialChatMessages,
} from "./lib/chat-transport";

type ChatSession = {
  busy: boolean;
  messages: CardChatMessage[];
  send: (text: string) => void;
  streaming: boolean;
};

const ChatSessionContext = createContext<ChatSession | null>(null);

export function ChatCardProvider({ children }: { children: ReactNode }) {
  const { messages, sendMessage, status } = useChat<CardChatMessage>({
    throttle: 50,
    messages: initialChatMessages,
    transport: chatTransport,
  });
  const streaming = status === "streaming";
  const busy = streaming || status === "submitted";
  const value = useMemo<ChatSession>(
    () => ({
      busy,
      messages,
      send: (text) => {
        void sendMessage({ text });
      },
      streaming,
    }),
    [busy, messages, sendMessage, streaming]
  );
  return (
    <ChatSessionContext.Provider value={value}>
      {children}
    </ChatSessionContext.Provider>
  );
}

export function useChatSession() {
  const session = useContext(ChatSessionContext);
  if (!session) {
    throw new Error("useChatSession must be used under ChatCardProvider");
  }
  return session;
}

type CardPart = CardChatMessage["parts"][number];

function toolNameOf(part: CardPart) {
  if ("toolName" in part && typeof part.toolName === "string") {
    return part.toolName;
  }
  if (part.type.startsWith("tool-")) {
    return part.type.slice(5);
  }
  return part.type;
}

function VrPart({
  isStreaming,
  part,
}: {
  isStreaming?: boolean;
  part: CardPart;
}) {
  const theme = useWorldTheme();
  if (isTextUIPart(part) && part.text) {
    if (isStreaming || part.state === "streaming") {
      return (
        <Text color={theme.text} fontSize={13}>
          {asciiSafe(part.text)}
        </Text>
      );
    }
    return <VrMarkdown markdown={part.text} />;
  }
  if (part.type === "reasoning" && "text" in part && part.text) {
    return (
      <VrReasoning
        isStreaming={
          Boolean(isStreaming) ||
          ("state" in part && part.state === "streaming")
        }
        text={part.text}
      />
    );
  }
  if (part.type === "dynamic-tool" || isToolUIPart(part)) {
    return (
      <VrTool
        input={"input" in part ? part.input : undefined}
        output={"output" in part ? part.output : undefined}
        toolName={toolNameOf(part)}
      />
    );
  }
  return null;
}

function VrAssistantParts({
  isStreaming,
  message,
}: {
  isStreaming: boolean;
  message: CardChatMessage;
}) {
  const duration = isStreaming
    ? undefined
    : message.metadata?.responseTime
      ? Math.round(message.metadata.responseTime / 1000)
      : undefined;
  return (
    <Container flexDirection="column" flexShrink={0} gap={8} width="100%">
      {splitWorkedParts(message.parts ?? []).map((segment) => {
        if (segment.kind === "worked") {
          const start = segment.items[0]?.index ?? 0;
          return (
            <VrWorked
              duration={duration}
              isStreaming={isStreaming}
              key={`w-${start}`}
            >
              {segment.items.map((item) => (
                <VrPart
                  isStreaming={isStreaming}
                  key={item.index}
                  part={item.part}
                />
              ))}
            </VrWorked>
          );
        }
        return (
          <VrPart
            isStreaming={isStreaming}
            key={segment.item.index}
            part={segment.item.part}
          />
        );
      })}
    </Container>
  );
}

function MessageRow({
  isStreaming,
  message,
}: {
  isStreaming: boolean;
  message: CardChatMessage;
}) {
  const mine = message.role === "user";
  const theme = useWorldTheme();
  const text = message.parts
    .filter(isTextUIPart)
    .map((part) => part.text)
    .join("\n");
  if (mine && !text) {
    return null;
  }
  return (
    <Container
      alignItems={mine ? "flex-end" : "flex-start"}
      flexDirection="column"
      flexShrink={0}
      width="100%"
    >
      {mine ? (
        <Container
          alignSelf="flex-end"
          backgroundColor={theme.bubble}
          borderRadius={10}
          flexShrink={0}
          maxWidth="80%"
          padding={8}
          width="auto"
        >
          <Text color={theme.text} fontSize={13}>
            {asciiSafe(text)}
          </Text>
        </Container>
      ) : (
        <Container flexShrink={0} maxWidth="100%" width="100%">
          <VrAssistantParts isStreaming={isStreaming} message={message} />
        </Container>
      )}
    </Container>
  );
}

export function ChatCardBody({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const theme = useWorldTheme();
  const { busy, messages, send, streaming } = useChatSession();
  const streamingId =
    streaming && messages.at(-1)?.role === "assistant"
      ? (messages.at(-1)?.id ?? null)
      : null;

  return (
    <Container
      backgroundColor={theme.card}
      borderRadius={12}
      flexDirection="column"
      gap={6}
      height={height}
      padding={8}
      pixelSize={0.001}
      pointerEvents="auto"
      width={width}
    >
      <Text color={theme.text} fontSize={14}>
        Assistant
      </Text>
      <Container
        backgroundColor={theme.border}
        flexShrink={0}
        height={1}
        width="100%"
      />
      <Container
        flexDirection="column"
        flexGrow={1}
        gap={6}
        minHeight={0}
        overflow="scroll"
        width="100%"
      >
        {messages.map((message) => (
          <MessageRow
            isStreaming={streamingId === message.id}
            key={message.id}
            message={message}
          />
        ))}
      </Container>
      <Container
        backgroundColor={theme.border}
        flexShrink={0}
        height={1}
        width="100%"
      />
      <VrChatInput
        disabled={busy}
        onSubmit={send}
        placeholder={busy ? "Working..." : "Ask in world space"}
      />
    </Container>
  );
}
