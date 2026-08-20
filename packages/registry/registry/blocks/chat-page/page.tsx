"use client";

import { Shell, ShellInset } from "@/components/ui/shell";
import { AppSidebar } from "./components/app-sidebar";
import { FullScreenChat } from "./components/full-screen-chat";

export default function ChatPage() {
  return (
    <Shell sidebar={<AppSidebar activeId="chat" />}>
      <ShellInset>
        <FullScreenChat />
      </ShellInset>
    </Shell>
  );
}
