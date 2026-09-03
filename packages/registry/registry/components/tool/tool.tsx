"use client";

import type { ToolUIPart } from "ai";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  CircleIcon,
  ClockIcon,
  WrenchIcon,
  XCircleIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { isValidElement } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export type ToolProps = ComponentProps<typeof Collapsible>;

export function Tool({ className, ...props }: ToolProps) {
  return (
    <Collapsible
      className={cn("not-prose mb-4 w-full rounded-md border", className)}
      data-slot="tool"
      {...props}
    />
  );
}

export type ToolStatusLabels = Partial<Record<ToolUIPart["state"], string>>;

const DEFAULT_STATUS_LABELS: Record<ToolUIPart["state"], string> = {
  "input-streaming": "Pending",
  "input-available": "Running",
  "approval-requested": "Awaiting Approval",
  "approval-responded": "Responded",
  "output-available": "Completed",
  "output-error": "Error",
  "output-denied": "Denied",
};

export interface ToolHeaderProps {
  title?: string;
  type: ToolUIPart["type"];
  state: ToolUIPart["state"];
  className?: string;
  statusLabels?: ToolStatusLabels;
}

function StatusBadge({
  status,
  statusLabels,
}: {
  status: ToolUIPart["state"];
  statusLabels?: ToolStatusLabels;
}) {
  const labels = { ...DEFAULT_STATUS_LABELS, ...statusLabels };
  const icons: Record<ToolUIPart["state"], ReactNode> = {
    "input-streaming": <CircleIcon className="text-muted-foreground" />,
    "input-available": (
      <ClockIcon className="animate-pulse text-muted-foreground" />
    ),
    "approval-requested": <ClockIcon className="text-muted-foreground" />,
    "approval-responded": <CheckCircleIcon className="text-muted-foreground" />,
    "output-available": <CheckCircleIcon className="text-muted-foreground" />,
    "output-error": <XCircleIcon className="text-destructive" />,
    "output-denied": <XCircleIcon className="text-destructive" />,
  };

  return (
    <Badge className="gap-1.5 rounded-full text-xs" variant="secondary">
      {icons[status]}
      {labels[status]}
    </Badge>
  );
}

export function ToolHeader({
  className,
  title,
  type,
  state,
  statusLabels,
  ...props
}: ToolHeaderProps) {
  return (
    <CollapsibleTrigger
      className={cn(
        "flex w-full items-center justify-between gap-4 p-3",
        className
      )}
      data-slot="tool-header"
      {...props}
    >
      <div className="flex items-center gap-2">
        <WrenchIcon className="text-muted-foreground" />
        <span className="font-medium text-sm">
          {title ?? type.split("-").slice(1).join("-")}
        </span>
        <StatusBadge status={state} statusLabels={statusLabels} />
      </div>
      <ChevronDownIcon className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
    </CollapsibleTrigger>
  );
}

export type ToolContentProps = ComponentProps<typeof CollapsibleContent>;

export function ToolContent({ className, ...props }: ToolContentProps) {
  return (
    <CollapsibleContent
      className={cn("text-popover-foreground outline-none", className)}
      data-slot="tool-content"
      {...props}
    />
  );
}

function JsonPre({ value }: { value: unknown }) {
  const text =
    typeof value === "string" ? value : JSON.stringify(value, null, 2);
  return <pre className="overflow-x-auto p-3 font-mono text-xs">{text}</pre>;
}

export type ToolInputProps = ComponentProps<"div"> & {
  input: ToolUIPart["input"];
  parametersLabel?: string;
};

export function ToolInput({
  className,
  input,
  parametersLabel = "Parameters",
  ...props
}: ToolInputProps) {
  return (
    <div
      className={cn("overflow-hidden p-4", className)}
      data-slot="tool-input"
      {...props}
    >
      <div className="flex flex-col gap-2">
        <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          {parametersLabel}
        </h4>
        <div className="rounded-md bg-muted/50">
          <JsonPre value={input} />
        </div>
      </div>
    </div>
  );
}

export type ToolOutputProps = ComponentProps<"div"> & {
  output: ToolUIPart["output"];
  errorText: ToolUIPart["errorText"];
  resultLabel?: string;
  errorLabel?: string;
};

export function ToolOutput({
  className,
  output,
  errorText,
  resultLabel = "Result",
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
    <div className={cn("p-4", className)} data-slot="tool-output" {...props}>
      <div className="flex flex-col gap-2">
        <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          {errorText ? errorLabel : resultLabel}
        </h4>
        <div
          className={cn(
            "overflow-x-auto rounded-md text-xs [&_table]:w-full",
            errorText
              ? "bg-destructive/10 text-destructive"
              : "bg-muted/50 text-foreground"
          )}
        >
          {errorText ? <div className="p-3">{errorText}</div> : body}
        </div>
      </div>
    </div>
  );
}
