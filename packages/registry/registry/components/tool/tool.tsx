"use client";

import type { ToolUIPart } from "ai";
import { ChevronDownIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { isValidElement } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export type ToolProps = ComponentProps<typeof Collapsible>;

export function Tool({ className, defaultOpen = false, ...props }: ToolProps) {
  return (
    <Collapsible
      className={cn("not-prose my-1 w-full min-w-0", className)}
      data-slot="tool"
      defaultOpen={defaultOpen}
      {...props}
    />
  );
}

function readableToolName(name: string) {
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toolInputSummary(
  toolName: string,
  input: unknown
): string | undefined {
  if (!input || typeof input !== "object") {
    return;
  }
  const record = input as Record<string, unknown>;
  const name = toolName.toLowerCase();
  if (
    (name === "bash" || name === "shell") &&
    typeof record.command === "string"
  ) {
    return record.command;
  }
  const path = record.file_path ?? record.path ?? record.filePath;
  if (typeof path === "string") {
    return path;
  }
  if (typeof record.pattern === "string") {
    return record.pattern;
  }
  if (typeof record.query === "string") {
    return record.query;
  }
}

function truncateSummary(value: string, max = 72): string {
  const trimmed = value.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) {
    return trimmed;
  }
  return `${trimmed.slice(0, max - 1)}…`;
}

export function toolTitle(toolName: string, input?: unknown): string {
  const readable = readableToolName(toolName);
  const summary =
    input === undefined ? undefined : toolInputSummary(toolName, input);
  if (!summary) {
    return readable;
  }
  return `${readable} · ${truncateSummary(summary)}`;
}

export interface ToolHeaderProps {
  title?: string;
  type: ToolUIPart["type"];
  state: ToolUIPart["state"];
  input?: unknown;
  className?: string;
}

export function ToolHeader({
  className,
  title,
  type,
  state,
  input,
  ...props
}: ToolHeaderProps) {
  const toolName = title ?? type.split("-").slice(1).join("-");
  const label = toolTitle(toolName, input);
  const isRunning =
    state === "input-available" ||
    state === "input-streaming" ||
    state === "approval-responded";
  const needsApproval = state === "approval-requested";
  const isDenied = state === "output-denied";
  const isError = state === "output-error";

  return (
    <CollapsibleTrigger
      className={cn(
        "group inline-flex max-w-full cursor-pointer items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground",
        className
      )}
      data-slot="tool-header"
      {...props}
    >
      <span
        className={cn(
          "truncate",
          (isRunning || needsApproval) && "animate-pulse"
        )}
      >
        {label}
      </span>
      {needsApproval ? (
        <span className="shrink-0 text-xs">Needs approval</span>
      ) : null}
      {isDenied ? (
        <span className="shrink-0 text-destructive text-xs">Denied</span>
      ) : null}
      {isError ? (
        <span className="shrink-0 text-destructive text-xs">Error</span>
      ) : null}
      <ChevronDownIcon className="size-3.5 shrink-0 -rotate-90 transition-transform group-data-[panel-open]:rotate-0" />
    </CollapsibleTrigger>
  );
}

export type ToolContentProps = ComponentProps<typeof CollapsibleContent>;

export function ToolContent({ className, ...props }: ToolContentProps) {
  return (
    <CollapsibleContent
      className={cn(
        "flex flex-col gap-1 py-1 text-muted-foreground text-sm outline-none",
        className
      )}
      data-slot="tool-content"
      {...props}
    />
  );
}

function JsonPre({ value }: { value: unknown }) {
  const text =
    typeof value === "string" ? value : JSON.stringify(value, null, 2);
  return <pre className="overflow-x-auto font-mono text-xs">{text}</pre>;
}

export type ToolInputProps = ComponentProps<"div"> & {
  input: ToolUIPart["input"];
  label?: string;
};

export function ToolInput({
  className,
  input,
  label = "Input",
  ...props
}: ToolInputProps) {
  if (input == null) {
    return null;
  }

  return (
    <div
      className={cn("flex flex-col gap-0.5 overflow-hidden", className)}
      data-slot="tool-input"
      {...props}
    >
      <p className="text-muted-foreground text-xs">{label}</p>
      <JsonPre value={input} />
    </div>
  );
}

export type ToolOutputProps = ComponentProps<"div"> & {
  output: ToolUIPart["output"];
  errorText: ToolUIPart["errorText"];
  label?: string;
  errorLabel?: string;
};

export function ToolOutput({
  className,
  output,
  errorText,
  label = "Output",
  errorLabel = "Error",
  ...props
}: ToolOutputProps) {
  if (!(output || errorText)) {
    return null;
  }

  let body: ReactNode = output as ReactNode;
  if (typeof output === "object" && !isValidElement(output)) {
    body = <JsonPre value={output} />;
  } else if (typeof output === "string") {
    body = <JsonPre value={output} />;
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 overflow-x-auto text-xs",
        errorText ? "text-destructive" : "text-foreground",
        className
      )}
      data-slot="tool-output"
      {...props}
    >
      <p className="text-muted-foreground text-xs">
        {errorText ? errorLabel : label}
      </p>
      {errorText ? errorText : body}
    </div>
  );
}
