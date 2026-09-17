"use client";

import { Container, Text } from "@react-three/uikit";
import { useState } from "react";
import { VrChatInput } from "@/components/ui/vr-chat-input";
import { asciiSafe, VrMarkdown } from "@/components/ui/vr-markdown";
import { VrReasoning } from "@/components/ui/vr-reasoning";
import { VrTool } from "@/components/ui/vr-tool";
import { VrWorked } from "@/components/ui/vr-worked";
import { splitWorkedParts } from "@/components/ui/worked";
import { useWorldTheme } from "@/components/ui/world-card";
import {
  type CardMessage,
  type CardPart,
  INITIAL_MESSAGES,
} from "./mock-messages";

function VrPart({ part }: { part: CardPart }) {
  if (part.type === "text" && part.text) {
    return <VrMarkdown markdown={part.text} />;
  }
  if (part.type === "reasoning" && part.text) {
    return <VrReasoning text={part.text} />;
  }
  if (part.type.startsWith("tool-") || part.type === "dynamic-tool") {
    return (
      <VrTool
        input={part.input}
        output={part.output}
        toolName={part.toolName ?? part.type}
      />
    );
  }
  return null;
}

function VrAssistantParts({ message }: { message: CardMessage }) {
  return (
    <Container flexDirection="column" flexShrink={0} gap={8} width="100%">
      {splitWorkedParts(message.parts).map((segment) => {
        if (segment.kind === "worked") {
          const start = segment.items[0]?.index ?? 0;
          return (
            <VrWorked key={`w-${start}`}>
              {segment.items.map((item) => (
                <VrPart key={item.index} part={item.part} />
              ))}
            </VrWorked>
          );
        }
        return <VrPart key={segment.item.index} part={segment.item.part} />;
      })}
    </Container>
  );
}

function XrMessageRow({ message }: { message: CardMessage }) {
  const mine = message.role === "user";
  const theme = useWorldTheme();
  const text = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
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
          <VrAssistantParts message={message} />
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
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  const send = (text: string) => {
    const id = `m-${messages.length + 1}`;
    setMessages((current) => [
      ...current,
      { id: `${id}-u`, parts: [{ text, type: "text" }], role: "user" },
      {
        id: `${id}-a`,
        parts: [
          {
            text: "Mocked reply. Point the transport at your API when you have one.",
            type: "text",
          },
        ],
        role: "assistant",
      },
    ]);
  };

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
          <XrMessageRow key={message.id} message={message} />
        ))}
      </Container>
      <Container
        backgroundColor={theme.border}
        flexShrink={0}
        height={1}
        width="100%"
      />
      <VrChatInput onSubmit={send} />
    </Container>
  );
}
