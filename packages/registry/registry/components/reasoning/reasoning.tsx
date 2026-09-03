"use client";

import { BrainIcon, ChevronDownIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  duration: number | undefined;
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
  duration?: number;
  onOpenChange?: (open: boolean) => void;
};

const AUTO_CLOSE_MS = 1000;

export function Reasoning({
  className,
  isStreaming = false,
  open,
  defaultOpen = true,
  onOpenChange,
  duration: durationProp,
  children,
  ...props
}: ReasoningProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;

  const [duration, setDuration] = useState<number | undefined>(durationProp);
  const [startTime, setStartTime] = useState<number | null>(() =>
    isStreaming ? Date.now() : null
  );
  const [wasStreaming, setWasStreaming] = useState(isStreaming);
  const [hasAutoClosed, setHasAutoClosed] = useState(false);

  if (durationProp !== undefined && durationProp !== duration) {
    setDuration(durationProp);
  }

  if (isStreaming !== wasStreaming) {
    setWasStreaming(isStreaming);
    if (isStreaming) {
      setStartTime(Date.now());
    } else if (startTime !== null) {
      setDuration(Math.ceil((Date.now() - startTime) / 1000));
      setStartTime(null);
    }
  }

  const setIsOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  // biome-ignore lint/plugin/no-use-effect: auto-close timer after the stream ends
  useEffect(() => {
    if (defaultOpen && !isStreaming && isOpen && !hasAutoClosed) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        setHasAutoClosed(true);
      }, AUTO_CLOSE_MS);
      return () => clearTimeout(timer);
    }
  }, [defaultOpen, isStreaming, isOpen, hasAutoClosed, setIsOpen]);

  return (
    <ReasoningContext.Provider value={{ isStreaming, isOpen, duration }}>
      <Collapsible
        className={cn("not-prose mb-4", className)}
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

export type ReasoningTriggerProps = ComponentProps<
  typeof CollapsibleTrigger
> & {
  getThinkingMessage?: (isStreaming: boolean, duration?: number) => ReactNode;
};

function defaultThinkingMessage(isStreaming: boolean, duration?: number) {
  if (isStreaming || duration === 0) {
    return <p className="animate-pulse">Thinking...</p>;
  }
  if (duration === undefined) {
    return <p>Thought for a few seconds</p>;
  }
  return <p>Thought for {duration} seconds</p>;
}

export function ReasoningTrigger({
  className,
  children,
  getThinkingMessage = defaultThinkingMessage,
  ...props
}: ReasoningTriggerProps) {
  const { isStreaming, isOpen, duration } = useReasoning();

  return (
    <CollapsibleTrigger
      className={cn(
        "flex w-full items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground",
        className
      )}
      data-slot="reasoning-trigger"
      {...props}
    >
      {children ?? (
        <>
          <BrainIcon />
          {getThinkingMessage(isStreaming, duration)}
          <ChevronDownIcon
            className={cn(
              "transition-transform",
              isOpen ? "rotate-180" : "rotate-0"
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
        "mt-4 text-muted-foreground text-sm outline-none",
        className
      )}
      data-slot="reasoning-content"
      {...props}
    >
      <Streamdown>{children}</Streamdown>
    </CollapsibleContent>
  );
}
