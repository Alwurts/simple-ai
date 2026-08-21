"use client";

import {
  type DynamicToolUIPart,
  isTextUIPart,
  isToolUIPart,
  type ToolUIPart,
  type UIMessagePart,
  type UITools,
} from "ai";
import { CheckIcon, CircleIcon, CopyIcon } from "lucide-react";
import { Streamdown } from "streamdown";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import {
  Message,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ui/reasoning";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ui/tool";
import { cn } from "@/lib/utils";
import type { AIDataPart } from "../lib/ai-types";
import type { GalleryChatMessage } from "../lib/mock-chat-messages";

function MarkdownBody({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <Streamdown
      className={cn(
        "size-full text-base [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
    >
      {children}
    </Streamdown>
  );
}

function PlanPart({
  entries,
  messageId,
  partIndex,
}: {
  entries: AIDataPart["plan"]["entries"];
  messageId: string;
  partIndex: number;
}) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <div
      className="my-2 flex flex-col gap-1"
      key={`${messageId}-plan-${partIndex}`}
    >
      {entries.map((entry, index) => {
        const done = entry.status === "completed";
        return (
          <Marker
            // biome-ignore lint/suspicious/noArrayIndexKey: plan entries have no stable id
            key={`${messageId}-plan-${partIndex}-${index}`}
          >
            <MarkerIcon>{done ? <CheckIcon /> : <CircleIcon />}</MarkerIcon>
            <MarkerContent className={cn(done && "line-through")}>
              {entry.content}
            </MarkerContent>
          </Marker>
        );
      })}
    </div>
  );
}

function DefaultToolPart({
  part,
  messageId,
  partIndex,
}: {
  part: DynamicToolUIPart | ToolUIPart;
  messageId: string;
  partIndex: number;
}) {
  const toolName =
    "toolName" in part && typeof part.toolName === "string"
      ? part.toolName
      : part.type.slice(5);

  return (
    <Tool defaultOpen={false} key={`${messageId}-tool-${partIndex}`}>
      <ToolHeader
        state={part.state}
        title={toolName.replace(/_/g, " ")}
        type={`tool-${toolName}` as ToolUIPart["type"]}
      />
      <ToolContent>
        <ToolInput input={part.input} />
        <ToolOutput errorText={part.errorText} output={part.output} />
      </ToolContent>
    </Tool>
  );
}

function GalleryMessagePart({
  part,
  messageId,
  partIndex,
  isLastPart,
  isStreaming,
  role,
}: {
  part: UIMessagePart<AIDataPart, UITools>;
  messageId: string;
  partIndex: number;
  isLastPart: boolean;
  isStreaming: boolean;
  role: GalleryChatMessage["role"];
}) {
  if (part.type === "text") {
    if (role === "user") {
      return (
        <Bubble align="end" variant="secondary">
          <BubbleContent>
            <MarkdownBody>{part.text}</MarkdownBody>
          </BubbleContent>
        </Bubble>
      );
    }

    return (
      <Bubble variant="ghost">
        <BubbleContent className="w-full max-w-full">
          <MarkdownBody>{part.text}</MarkdownBody>
        </BubbleContent>
      </Bubble>
    );
  }

  if (part.type === "reasoning") {
    return (
      <Reasoning
        className="my-2"
        defaultOpen={true}
        isStreaming={isStreaming && isLastPart}
        key={`${messageId}-reasoning-${partIndex}`}
      >
        <ReasoningTrigger />
        <ReasoningContent>{part.text}</ReasoningContent>
      </Reasoning>
    );
  }

  if (part.type === "dynamic-tool" || isToolUIPart(part)) {
    return (
      <DefaultToolPart
        key={`${messageId}-tool-${partIndex}`}
        messageId={messageId}
        part={part as DynamicToolUIPart | ToolUIPart}
        partIndex={partIndex}
      />
    );
  }

  if (part.type === "data-plan") {
    return (
      <PlanPart
        entries={part.data.entries}
        key={`${messageId}-plan-${partIndex}`}
        messageId={messageId}
        partIndex={partIndex}
      />
    );
  }

  return null;
}

export function ChatMessageRow({
  message,
  isStreaming = false,
}: {
  message: GalleryChatMessage;
  isStreaming?: boolean;
}) {
  const textForCopy = message.parts
    .filter(isTextUIPart)
    .map((part) => part.text)
    .join("\n\n");
  const align = message.role === "user" ? "end" : "start";

  return (
    <Message align={align}>
      <MessageContent>
        {message.parts.map((part, partIndex) => (
          <GalleryMessagePart
            isLastPart={partIndex === message.parts.length - 1}
            isStreaming={isStreaming}
            // biome-ignore lint/suspicious/noArrayIndexKey: part order within a message is stable
            key={`${message.id}-part-${partIndex}`}
            messageId={message.id}
            part={part}
            partIndex={partIndex}
            role={message.role}
          />
        ))}
        {message.role === "assistant" && textForCopy ? (
          <MessageFooter>
            <Button
              aria-label="Copy"
              onClick={() => navigator.clipboard.writeText(textForCopy)}
              size="icon-xs"
              title="Copy"
              type="button"
              variant="ghost"
            >
              <CopyIcon className="size-3.5" />
            </Button>
          </MessageFooter>
        ) : null}
      </MessageContent>
    </Message>
  );
}
