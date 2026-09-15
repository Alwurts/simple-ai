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
import {
  splitWorkedParts,
  Worked,
  WorkedContent,
  WorkedTrigger,
} from "@/components/ui/worked";
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
  onToolApproval,
}: {
  part: DynamicToolUIPart | ToolUIPart;
  messageId: string;
  partIndex: number;
  onToolApproval?: (id: string, approved: boolean) => void;
}) {
  const toolName =
    "toolName" in part && typeof part.toolName === "string"
      ? part.toolName
      : part.type.slice(5);
  const approvalId =
    part.state === "approval-requested" ? part.approval?.id : undefined;
  const deniedReason =
    part.state === "output-denied" ? part.approval?.reason : undefined;

  return (
    <Tool
      defaultOpen={part.state === "approval-requested"}
      key={`${messageId}-tool-${partIndex}`}
    >
      <ToolHeader
        input={part.input}
        state={part.state}
        title={toolName}
        type={`tool-${toolName}` as ToolUIPart["type"]}
      />
      <ToolContent>
        <ToolInput input={part.input} />
        {part.state === "output-denied" ? (
          <p className="text-destructive text-xs">
            {deniedReason ? `Denied: ${deniedReason}` : "Denied"}
          </p>
        ) : (
          <ToolOutput errorText={part.errorText} output={part.output} />
        )}
        {approvalId && onToolApproval ? (
          <div className="flex gap-2 py-1">
            <Button
              onClick={() => onToolApproval(approvalId, true)}
              size="xs"
              type="button"
            >
              Approve
            </Button>
            <Button
              onClick={() => onToolApproval(approvalId, false)}
              size="xs"
              type="button"
              variant="outline"
            >
              Deny
            </Button>
          </div>
        ) : null}
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
  onToolApproval,
}: {
  part: UIMessagePart<AIDataPart, UITools>;
  messageId: string;
  partIndex: number;
  isLastPart: boolean;
  isStreaming: boolean;
  role: GalleryChatMessage["role"];
  onToolApproval?: (id: string, approved: boolean) => void;
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
        onToolApproval={onToolApproval}
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

function workedDurationSeconds(
  message: GalleryChatMessage
): number | undefined {
  const responseTime = message.metadata?.responseTime;
  if (typeof responseTime !== "number" || responseTime <= 0) {
    return;
  }
  return Math.max(1, Math.round(responseTime / 1000));
}

export function ChatMessageRow({
  message,
  isStreaming = false,
  onToolApproval,
}: {
  message: GalleryChatMessage;
  isStreaming?: boolean;
  onToolApproval?: (id: string, approved: boolean) => void;
}) {
  const textForCopy = message.parts
    .filter(isTextUIPart)
    .map((part) => part.text)
    .join("\n\n");
  const align = message.role === "user" ? "end" : "start";
  const lastPartIndex = message.parts.length - 1;
  const duration = workedDurationSeconds(message);

  const partRow = (
    part: GalleryChatMessage["parts"][number],
    partIndex: number
  ) => (
    <GalleryMessagePart
      isLastPart={partIndex === lastPartIndex}
      isStreaming={isStreaming}
      key={`${message.id}-part-${partIndex}`}
      messageId={message.id}
      onToolApproval={onToolApproval}
      part={part}
      partIndex={partIndex}
      role={message.role}
    />
  );

  return (
    <Message align={align}>
      <MessageContent>
        {message.role === "assistant"
          ? splitWorkedParts(message.parts).map((segment) => {
              if (segment.kind === "worked") {
                const start = segment.items[0]?.index ?? 0;
                return (
                  <Worked
                    duration={duration}
                    isStreaming={isStreaming}
                    key={`${message.id}-worked-${start}`}
                  >
                    <WorkedTrigger />
                    <WorkedContent>
                      {segment.items.map((item) =>
                        partRow(item.part, item.index)
                      )}
                    </WorkedContent>
                  </Worked>
                );
              }
              return partRow(segment.item.part, segment.item.index);
            })
          : message.parts.map((part, partIndex) => partRow(part, partIndex))}
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
