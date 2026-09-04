"use client";

import { ChevronDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { createContext, useCallback, useContext, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export interface WorkedPart {
  type: string;
}

export interface IndexedWorkedPart<T extends WorkedPart> {
  part: T;
  index: number;
}

export type WorkedSegment<T extends WorkedPart> =
  | { kind: "worked"; items: IndexedWorkedPart<T>[] }
  | { kind: "visible"; item: IndexedWorkedPart<T> };

export function isWorkedPart(part: WorkedPart): boolean {
  return (
    part.type === "reasoning" ||
    part.type === "dynamic-tool" ||
    part.type === "data-plan" ||
    part.type.startsWith("tool-")
  );
}

export function splitWorkedParts<T extends WorkedPart>(
  parts: readonly T[]
): WorkedSegment<T>[] {
  let lastTextIndex = -1;
  for (let i = parts.length - 1; i >= 0; i--) {
    if (parts[i]?.type === "text") {
      lastTextIndex = i;
      break;
    }
  }

  const segments: WorkedSegment<T>[] = [];
  let pending: IndexedWorkedPart<T>[] = [];

  const flush = () => {
    if (pending.length === 0) {
      return;
    }
    segments.push({ kind: "worked", items: pending });
    pending = [];
  };

  for (let index = 0; index < parts.length; index++) {
    const part = parts[index];
    if (!part) {
      continue;
    }
    const beforeTerminal = lastTextIndex === -1 || index < lastTextIndex;
    if (beforeTerminal && isWorkedPart(part)) {
      pending.push({ part, index });
      continue;
    }
    flush();
    segments.push({ kind: "visible", item: { part, index } });
  }
  flush();
  return segments;
}

export function formatWorkedDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  if (total < 60) {
    return `${total}s`;
  }
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return rest === 0 ? `${minutes}m` : `${minutes}m ${rest}s`;
}

export function workedLabel({
  isStreaming,
  duration,
}: {
  isStreaming: boolean;
  duration?: number;
}): string {
  if (isStreaming) {
    return "Working";
  }
  if (duration === undefined || duration <= 0) {
    return "Worked";
  }
  return `Worked for ${formatWorkedDuration(duration)}`;
}

interface WorkedContextValue {
  isStreaming: boolean;
  isOpen: boolean;
  duration?: number;
}

const WorkedContext = createContext<WorkedContextValue | null>(null);

export function useWorked() {
  const context = useContext(WorkedContext);
  if (!context) {
    throw new Error("Worked parts must be used within <Worked>");
  }
  return context;
}

export type WorkedProps = Omit<
  ComponentProps<typeof Collapsible>,
  "onOpenChange"
> & {
  isStreaming?: boolean;
  duration?: number;
  onOpenChange?: (open: boolean) => void;
};

export function Worked({
  className,
  isStreaming = false,
  duration,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  ...props
}: WorkedProps) {
  const [userOverride, setUserOverride] = useState<boolean | null>(null);
  const isControlled = open !== undefined;
  const isOpen = isControlled
    ? open
    : (userOverride ?? (isStreaming || defaultOpen));

  const setIsOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUserOverride(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  return (
    <WorkedContext.Provider value={{ isStreaming, isOpen, duration }}>
      <Collapsible
        className={cn("not-prose my-1 w-full min-w-0", className)}
        data-slot="worked"
        onOpenChange={setIsOpen}
        open={isOpen}
        {...props}
      >
        {children}
      </Collapsible>
    </WorkedContext.Provider>
  );
}

export type WorkedTriggerProps = ComponentProps<typeof CollapsibleTrigger>;

export function WorkedTrigger({
  className,
  children,
  ...props
}: WorkedTriggerProps) {
  const { isStreaming, isOpen, duration } = useWorked();

  return (
    <CollapsibleTrigger
      className={cn(
        "inline-flex max-w-full cursor-pointer items-center gap-1 text-muted-foreground text-sm tabular-nums transition-colors hover:text-foreground",
        className
      )}
      data-slot="worked-trigger"
      role={isStreaming ? "status" : undefined}
      {...props}
    >
      {children ?? (
        <>
          <span className={cn("truncate", isStreaming && "animate-pulse")}>
            {workedLabel({ isStreaming, duration })}
          </span>
          <ChevronDownIcon
            className={cn(
              "size-3.5 shrink-0 transition-transform",
              isOpen ? "rotate-0" : "-rotate-90"
            )}
          />
        </>
      )}
    </CollapsibleTrigger>
  );
}

export type WorkedContentProps = ComponentProps<typeof CollapsibleContent>;

export function WorkedContent({ className, ...props }: WorkedContentProps) {
  return (
    <CollapsibleContent
      className={cn("flex flex-col gap-1 py-1 outline-none", className)}
      data-slot="worked-content"
      {...props}
    />
  );
}
