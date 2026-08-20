"use client";

import { useMemo } from "react";
import { ChatVoiceButton } from "@/components/ui/chat-voice-button";
import { InputGroup } from "@/components/ui/input-group";

export default function ChatVoiceButtonPreview() {
  const controller = useMemo(
    () => ({
      textInput: {
        value: "",
        setInput: () => undefined,
        clear: () => undefined,
      },
    }),
    []
  );

  return (
    <InputGroup className="w-fit">
      <ChatVoiceButton controller={controller} />
    </InputGroup>
  );
}
