"use client";

import { Container, Input, Text } from "@react-three/uikit";
import { ChevronDown, Send } from "@react-three/uikit-lucide";
import { type ReactNode, useState } from "react";
import { toolTitle } from "@/components/ui/tool";
import { splitWorkedParts, workedLabel } from "@/components/ui/worked";
import { useWorldTheme } from "@/components/ui/world-card";
import {
  type CardMessage,
  type CardPart,
  INITIAL_MESSAGES,
} from "./mock-messages";

function asciiSafe(value: string) {
  return value.replace(/[^\u0020-\u007e]/g, "?");
}

function XrReasoning({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const theme = useWorldTheme();
  return (
    <Container width="100%" flexShrink={0} flexDirection="column" gap={2}>
      <Container
        flexDirection="row"
        alignItems="center"
        gap={4}
        onClick={() => setOpen((value) => !value)}
      >
        <ChevronDown
          color={theme.subtle}
          height={12}
          transformRotateZ={open ? 0 : 90}
          width={12}
        />
        <Text color={theme.subtle} fontSize={12}>
          Reasoning
        </Text>
      </Container>
      {open ? (
        <Text color={theme.subtle} fontSize={12}>
          {asciiSafe(text)}
        </Text>
      ) : null}
    </Container>
  );
}

function XrWorked({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const theme = useWorldTheme();
  return (
    <Container width="100%" flexShrink={0} flexDirection="column" gap={4}>
      <Container
        flexDirection="row"
        alignItems="center"
        gap={4}
        onClick={() => setOpen((value) => !value)}
      >
        <ChevronDown
          color={theme.subtle}
          height={12}
          transformRotateZ={open ? 0 : 90}
          width={12}
        />
        <Text color={theme.subtle} fontSize={12}>
          {workedLabel({ isStreaming: false })}
        </Text>
      </Container>
      {open ? (
        <Container
          flexDirection="column"
          flexShrink={0}
          gap={4}
          paddingLeft={8}
        >
          {children}
        </Container>
      ) : null}
    </Container>
  );
}

function XrPart({ part }: { part: CardPart }) {
  const theme = useWorldTheme();
  if (part.type === "text" && part.text) {
    return (
      <Text color={theme.text} fontSize={13}>
        {asciiSafe(part.text)}
      </Text>
    );
  }
  if (part.type === "reasoning" && part.text) {
    return <XrReasoning text={part.text} />;
  }
  if (part.type.startsWith("tool-") || part.type === "dynamic-tool") {
    return (
      <Text color={theme.subtle} fontSize={12}>
        {asciiSafe(toolTitle(part.toolName ?? part.type, part.input))}
      </Text>
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
  const [draft, setDraft] = useState("");

  const send = () => {
    const text = draft.trim();
    if (!text) {
      return;
    }
    const id = `m-${messages.length + 1}`;
    setMessages((current) => [
      ...current,
      { id: `${id}-u`, role: "user", parts: [{ type: "text", text }] },
      {
        id: `${id}-a`,
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Mocked reply. Point the transport at your API when you have one.",
          },
        ],
      },
    ]);
    setDraft("");
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
      <Container
        alignItems="center"
        flexDirection="row"
        flexShrink={0}
        gap={4}
        width="100%"
      >
        <Container
          backgroundColor={theme.muted}
          borderRadius={8}
          flexGrow={1}
          height={36}
          minWidth={0}
          paddingX={8}
        >
          <Input
            onValueChange={(value: string) => setDraft(value)}
            placeholder="Ask in world space"
            value={draft}
          />
        </Container>
        <Container onClick={send}>
          <Send color={theme.text} height={18} width={18} />
        </Container>
      </Container>
    </Container>
  );
}
