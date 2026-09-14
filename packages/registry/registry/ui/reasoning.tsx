"use client";

import { ChevronDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Streamdown } from "streamdown";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface ReasoningContextValue {
  isStreaming: boolean;
  isOpen: boolean;
}

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

export function useReasoning() {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error("Reasoning parts must be used within <Reasoning>");
  }
  return context;
}

export type ReasoningProps = Omit<
  ComponentProps<typeof Collapsible>,
  "onOpenChange"
> & {
  isStreaming?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function Reasoning({
  className,
  isStreaming = false,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  ...props
}: ReasoningProps) {
  const [userOverride, setUserOverride] = useState<boolean | null>(null);
  const hasStreamedRef = useRef(isStreaming);
  if (isStreaming) {
    hasStreamedRef.current = true;
  }
  const isControlled = open !== undefined;
  const isOpen = isControlled
    ? open
    : (userOverride ?? (isStreaming || hasStreamedRef.current || defaultOpen));

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
    <ReasoningContext.Provider value={{ isStreaming, isOpen }}>
      <Collapsible
        className={cn("not-prose my-1 w-full min-w-0", className)}
        data-slot="reasoning"
        onOpenChange={setIsOpen}
        open={isOpen}
        {...props}
      >
        {children}
      </Collapsible>
    </ReasoningContext.Provider>
  );
}

export type ReasoningTriggerProps = ComponentProps<typeof CollapsibleTrigger>;

export function ReasoningTrigger({
  className,
  children,
  ...props
}: ReasoningTriggerProps) {
  const { isStreaming, isOpen } = useReasoning();
  const title = isStreaming ? "Thinking..." : "Thought";

  return (
    <CollapsibleTrigger
      className={cn(
        "inline-flex max-w-full cursor-pointer items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground",
        className
      )}
      data-slot="reasoning-trigger"
      role={isStreaming ? "status" : undefined}
      {...props}
    >
      {children ?? (
        <>
          <span className={cn("truncate", isStreaming && "animate-pulse")}>
            {title}
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

export type ReasoningContentProps = ComponentProps<
  typeof CollapsibleContent
> & {
  children: string;
};

export function ReasoningContent({
  className,
  children,
  ...props
}: ReasoningContentProps) {
  return (
    <CollapsibleContent
      className={cn(
        "py-1 text-muted-foreground text-sm outline-none",
        className
      )}
      data-slot="reasoning-content"
      {...props}
    >
      <Streamdown>{children}</Streamdown>
    </CollapsibleContent>
  );
}
