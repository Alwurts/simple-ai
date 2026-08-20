import { Button } from "@workspace/ui/components/shadcn/button";
import { cn } from "@workspace/ui/lib/utils";
import { XIcon } from "lucide-react";
import type * as React from "react";

function ChatTokenGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex max-w-full flex-wrap items-center gap-1.5",
        className
      )}
      data-slot="chat-token-group"
      {...props}
    />
  );
}

function ChatToken({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-md border bg-muted/40 py-0.5 pr-1.5 pl-1 text-[11px] text-muted-foreground",
        className
      )}
      data-slot="chat-token"
      {...props}
    />
  );
}

function ChatTokenIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex size-3.5 shrink-0 items-center justify-center overflow-hidden rounded-[3px] [&_img]:size-full [&_img]:object-cover [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      data-slot="chat-token-icon"
      {...props}
    />
  );
}

function ChatTokenLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("min-w-0 truncate font-medium", className)}
      data-slot="chat-token-label"
      {...props}
    />
  );
}

function ChatTokenAction({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        "size-4 shrink-0 rounded-sm p-0 text-muted-foreground hover:text-foreground [&>svg]:size-2.5",
        className
      )}
      data-slot="chat-token-action"
      size="icon-xs"
      type="button"
      variant="ghost"
      {...props}
    />
  );
}

function ChatTokenRemove({
  label = "Remove",
  ...props
}: Omit<React.ComponentProps<typeof ChatTokenAction>, "children"> & {
  label?: string;
}) {
  return (
    <ChatTokenAction aria-label={label} {...props}>
      <XIcon />
      <span className="sr-only">{label}</span>
    </ChatTokenAction>
  );
}

export {
  ChatToken,
  ChatTokenAction,
  ChatTokenGroup,
  ChatTokenIcon,
  ChatTokenLabel,
  ChatTokenRemove,
};
