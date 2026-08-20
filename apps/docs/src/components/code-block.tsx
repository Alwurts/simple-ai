"use client";

import { Button } from "@workspace/ui/components/shadcn/button";
import { cn } from "@workspace/ui/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import {
  type ComponentProps,
  isValidElement,
  type ReactNode,
  useState,
} from "react";

function textFromNode(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(textFromNode).join("");
  }
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return textFromNode(props.children);
  }
  return "";
}

export function CodeBlock({
  className,
  children,
  ...props
}: ComponentProps<"pre">) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="group/code relative mt-6">
      <pre
        className={cn(
          "overflow-x-auto rounded-lg bg-code p-4 font-mono text-sm",
          className
        )}
        {...props}
      >
        {children}
      </pre>
      <Button
        className="absolute top-2 right-2 size-7 opacity-0 transition-opacity group-hover/code:opacity-100 focus-visible:opacity-100"
        onClick={() => {
          void navigator.clipboard.writeText(textFromNode(children).trim());
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        }}
        size="icon"
        variant="ghost"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        <span className="sr-only">Copy code</span>
      </Button>
    </div>
  );
}
