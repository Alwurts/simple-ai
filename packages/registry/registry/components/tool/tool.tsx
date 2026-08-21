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
import { CodeBlock } from "./code-block";

export type ToolProps = ComponentProps<typeof Collapsible>;

export const Tool = ({ className, ...props }: ToolProps) => (
  <Collapsible
    className={cn("not-prose mb-4 w-full rounded-md border", className)}
    {...props}
  />
);

/** Optional overrides for tool-part status badge copy. */
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

const getStatusBadge = (
  status: ToolUIPart["state"],
  statusLabels?: ToolStatusLabels
) => {
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
};

export const ToolHeader = ({
  className,
  title,
  type,
  state,
  statusLabels,
  ...props
}: ToolHeaderProps) => (
  <CollapsibleTrigger
    className={cn(
      "flex w-full items-center justify-between gap-4 p-3",
      className
    )}
    {...props}
  >
    <div className="flex items-center gap-2">
      <WrenchIcon className="text-muted-foreground" />
      <span className="font-medium text-sm">
        {title ?? type.split("-").slice(1).join("-")}
      </span>
      {getStatusBadge(state, statusLabels)}
    </div>
    <ChevronDownIcon className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
  </CollapsibleTrigger>
);

export type ToolContentProps = ComponentProps<typeof CollapsibleContent>;

export const ToolContent = ({ className, ...props }: ToolContentProps) => (
  <CollapsibleContent
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
      className
    )}
    {...props}
  />
);

export type ToolInputProps = ComponentProps<"div"> & {
  input: ToolUIPart["input"];
  parametersLabel?: string;
};

export const ToolInput = ({
  className,
  input,
  parametersLabel = "Parameters",
  ...props
}: ToolInputProps) => (
  <div className={cn("overflow-hidden p-4", className)} {...props}>
    <div className="flex flex-col gap-2">
      <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {parametersLabel}
      </h4>
      <div className="rounded-md bg-muted/50">
        <CodeBlock code={JSON.stringify(input, null, 2)} language="json" />
      </div>
    </div>
  </div>
);

export type ToolOutputProps = ComponentProps<"div"> & {
  output: ToolUIPart["output"];
  errorText: ToolUIPart["errorText"];
  resultLabel?: string;
  errorLabel?: string;
};

export const ToolOutput = ({
  className,
  output,
  errorText,
  resultLabel = "Result",
  errorLabel = "Error",
  ...props
}: ToolOutputProps) => {
  if (!(output || errorText)) {
    return null;
  }

  let Output = <div>{output as ReactNode}</div>;

  if (typeof output === "object" && !isValidElement(output)) {
    Output = (
      <CodeBlock code={JSON.stringify(output, null, 2)} language="json" />
    );
  } else if (typeof output === "string") {
    Output = <CodeBlock code={output} language="json" />;
  }

  return (
    <div className={cn("p-4", className)} {...props}>
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
          {errorText && <div>{errorText}</div>}
          {Output}
        </div>
      </div>
    </div>
  );
};
