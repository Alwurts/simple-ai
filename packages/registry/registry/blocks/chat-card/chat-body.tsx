"use client";

import { Container, Text } from "@react-three/uikit";
import { useState } from "react";
import { splitWorkedParts } from "@/components/ui/worked";
import { useWorldTheme } from "@/components/ui/world-card";
import { XrChatInput } from "@/components/ui/xr-chat-input";
import { asciiSafe, XrMarkdown } from "@/components/ui/xr-markdown";
import { XrReasoning } from "@/components/ui/xr-reasoning";
import { XrTool } from "@/components/ui/xr-tool";
import { XrWorked } from "@/components/ui/xr-worked";
import {
  type CardMessage,
  type CardPart,
  INITIAL_MESSAGES,
} from "./mock-messages";

function XrPart({ part }: { part: CardPart }) {
  if (part.type === "text" && part.text) {
    return <XrMarkdown markdown={part.text} />;
  }
  if (part.type === "reasoning" && part.text) {
    return <XrReasoning text={part.text} />;
  }
  if (part.type.startsWith("tool-") || part.type === "dynamic-tool") {
    return (
      <XrTool
        input={part.input}
        output={part.output}
        toolName={part.toolName ?? part.type}
      />
    );
  }
  return null;
}

function XrAssistantParts({ message }: { message: CardMessage }) {
  return (
    <Container flexDirection="column" flexShrink={0} gap={8} width="100%">
      {splitWorkedParts(message.parts).map((segment) => {
        if (segment.kind === "worked") {
          const start = segment.items[0]?.index ?? 0;
          return (
            <XrWorked key={`w-${start}`}>
              {segment.items.map((item) => (
                <XrPart key={item.index} part={item.part} />
              ))}
            </XrWorked>
          );
        }
        return <XrPart key={segment.item.index} part={segment.item.part} />;
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
          <XrAssistantParts message={message} />
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
      <XrChatInput onSubmit={send} />
    </Container>
  );
}
