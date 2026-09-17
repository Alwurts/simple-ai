"use client";

import { Container, Input } from "@react-three/uikit";
import { Send } from "@react-three/uikit-lucide";
import { useRef, useState } from "react";
import { useWorldTheme } from "@/components/ui/world-card";
import { XrButton } from "@/components/ui/xr-button";

export function XrChatInput({
  disabled = false,
  onSubmit,
  placeholder = "Ask in world space",
}: {
  disabled?: boolean;
  onSubmit: (text: string) => void;
  placeholder?: string;
}) {
  const theme = useWorldTheme();
  const [inputKey, setInputKey] = useState(0);
  const draft = useRef("");

  const send = () => {
    if (disabled) {
      return;
    }
    const text = draft.current.trim();
    if (!text) {
      return;
    }
    draft.current = "";
    setInputKey((key) => key + 1);
    onSubmit(text);
  };

  return (
    <Container
      alignItems="center"
      flexDirection="row"
      flexShrink={0}
      gap={4}
      width="100%"
    >
      <Container
        backgroundColor={theme.muted}
        borderRadius={8}
        flexGrow={1}
        height={36}
        minWidth={0}
        paddingX={8}
      >
        <Input
          disabled={disabled}
          key={inputKey}
          onValueChange={(value: string) => {
            draft.current = value;
          }}
          placeholder={placeholder}
        />
      </Container>
      <XrButton disabled={disabled} height={32} onClick={send} width={32}>
        <Send color={theme.text} height={18} width={18} />
      </XrButton>
    </Container>
  );
}
