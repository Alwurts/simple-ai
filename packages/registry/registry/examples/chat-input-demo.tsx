"use client";

import {
  ChatInput,
  ChatInputEditor,
  ChatInputMentionButton,
  ChatInputSubmitButton,
} from "@/components/ui/chat-input";
import { InputGroupAddon } from "@/components/ui/input-group";

const MEMBERS = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
  { id: "3", name: "Charlie" },
];

export default function ChatInputPreview() {
  return (
    <div className="w-full max-w-md">
      <ChatInput
        className="rounded-2xl"
        mentions={{
          member: {
            trigger: "@",
            items: MEMBERS,
          },
        }}
        onSubmit={(parsed, { clear }) => {
          console.log(parsed);
          clear();
        }}
        status="ready"
      >
        <ChatInputEditor placeholder="Type @ to mention..." />
        <InputGroupAddon align="block-end" className="pt-1">
          <ChatInputMentionButton />
          <div className="ml-auto">
            <ChatInputSubmitButton />
          </div>
        </InputGroupAddon>
      </ChatInput>
    </div>
  );
}
