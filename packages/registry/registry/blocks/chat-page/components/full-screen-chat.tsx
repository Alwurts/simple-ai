"use client";

import { useChat } from "@ai-sdk/react";
import { isTextUIPart } from "ai";
import {
  BotIcon,
  ClipboardCopyIcon,
  MessageCircleDashedIcon,
  MoreHorizontalIcon,
  PanelRightIcon,
  Trash2Icon,
} from "lucide-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  ShellHeader,
  ShellHeaderActions,
  ShellHeaderIcon,
  ShellHeaderSidebarTrigger,
  ShellHeaderTitle,
} from "@/components/ui/shell";
import { useChatSidePanel } from "../hooks/use-chat-side-panel";
import {
  chatTransport,
  type GalleryChatMessage,
  initialChatMessages,
} from "../lib/chat-transport";
import { GalleryChatInput, type GalleryPromptMessage } from "./chat-input";
import { ChatMessageRow } from "./chat-message-parts";
import { ChatSidePanel } from "./chat-side-panel";

function EmptyConversation() {
  return (
    <Empty className="h-full border-0">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessageCircleDashedIcon />
        </EmptyMedia>
        <EmptyTitle>How can I help?</EmptyTitle>
        <EmptyDescription>
          Ask a question to see tools, files, and mentions.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function FullScreenChat() {
  const { messages, sendMessage, setMessages, status, stop } =
    useChat<GalleryChatMessage>({
      throttle: 50,
      messages: initialChatMessages,
      transport: chatTransport,
    });
  const streamingMessageId =
    status === "streaming" && messages.at(-1)?.role === "assistant"
      ? (messages.at(-1)?.id ?? null)
      : null;
  const {
    panelOpen,
    tabs,
    activeTab,
    activeTabId,
    togglePanel,
    closePanel,
    openToolTab,
    closeTab,
    setActiveTabId,
  } = useChatSidePanel();
  const handleSubmit = useCallback(
    async (message: GalleryPromptMessage) => {
      const text = message.text.trim();
      const hasAttachments = Boolean(message.files?.length);
      if (!(text || hasAttachments)) {
        return;
      }
      await sendMessage({
        files: message.files,
        text: text || "Sent with attachments",
      });
    },
    [sendMessage]
  );
  const handleCopyConversation = useCallback(() => {
    const text = messages
      .map((message) => {
        const body = message.parts
          .filter(isTextUIPart)
          .map((part) => part.text)
          .join("\n");
        return `${message.role}: ${body}`;
      })
      .join("\n\n");
    navigator.clipboard.writeText(text).catch(() => undefined);
  }, [messages]);
  const handleDeleteConversation = useCallback(() => {
    stop();
    setMessages([]);
  }, [setMessages, stop]);
  return (
    <div
      className="@container flex h-full min-h-0 flex-col overflow-hidden bg-background"
      data-slot="full-screen-chat"
    >
      <ResizablePanelGroup
        className="min-h-0 flex-1"
        data-slot="full-screen-chat-layout"
        orientation="horizontal"
      >
        <ResizablePanel
          className="flex min-h-0 flex-col overflow-hidden"
          defaultSize={panelOpen ? "68%" : "100%"}
          minSize="45%"
        >
          <ShellHeader className="px-3" data-slot="full-screen-chat-header">
            <ShellHeaderSidebarTrigger className="-ml-1" />
            <div className="flex min-w-0 items-center gap-2 overflow-hidden">
              <ShellHeaderIcon>
                <BotIcon />
              </ShellHeaderIcon>
              <ShellHeaderTitle>Assistant</ShellHeaderTitle>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      className="size-7 shrink-0"
                      size="icon"
                      type="button"
                      variant="ghost"
                    />
                  }
                >
                  <MoreHorizontalIcon />
                  <span className="sr-only">More actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem onClick={handleCopyConversation}>
                    <ClipboardCopyIcon />
                    Copy conversation
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDeleteConversation}
                    variant="destructive"
                  >
                    <Trash2Icon />
                    Delete conversation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {panelOpen ? null : (
              <ShellHeaderActions>
                <Button
                  className="size-7 shrink-0"
                  onClick={togglePanel}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <PanelRightIcon />
                  <span className="sr-only">Open side panel</span>
                </Button>
              </ShellHeaderActions>
            )}
          </ShellHeader>

          <MessageScrollerProvider autoScroll>
            <MessageScroller className="h-0 min-h-0 flex-1">
              <MessageScrollerViewport>
                <MessageScrollerContent className="mx-auto w-full max-w-3xl gap-6 p-4">
                  {messages.length === 0 ? (
                    <EmptyConversation />
                  ) : (
                    messages.map((message) => (
                      <MessageScrollerItem
                        key={message.id}
                        messageId={message.id}
                        scrollAnchor={message.role === "user"}
                      >
                        <ChatMessageRow
                          isStreaming={streamingMessageId === message.id}
                          message={message}
                        />
                      </MessageScrollerItem>
                    ))
                  )}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>

          <GalleryChatInput
            onStop={stop}
            onSubmit={handleSubmit}
            status={status}
          />
        </ResizablePanel>

        {panelOpen ? (
          <>
            <ResizableHandle className="bg-transparent" />
            <ResizablePanel
              className="ml-px flex min-h-0 flex-col overflow-hidden rounded-l-xl border-border border-l bg-accent/5 shadow"
              defaultSize="32%"
              maxSize="55%"
              minSize="22%"
            >
              <ChatSidePanel
                activeTab={activeTab}
                activeTabId={activeTabId}
                onClosePanel={closePanel}
                onCloseTab={closeTab}
                onOpenToolTab={openToolTab}
                onSelectTab={setActiveTabId}
                tabs={tabs}
              />
            </ResizablePanel>
          </>
        ) : null}
      </ResizablePanelGroup>
    </div>
  );
}
