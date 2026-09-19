"use client";

import { Container, Input } from "@react-three/uikit";
import { Send, Square } from "@react-three/uikit-lucide";
import { useRef, useState } from "react";
import { VrButton } from "@/components/ui/vr-button";
import { useWorldTheme } from "@/components/ui/world-card";

export function VrChatInput({
  disabled = false,
  onStop,
  onSubmit,
  placeholder = "Ask the assistant",
}: {
  disabled?: boolean;
  onStop?: () => void;
  onSubmit: (text: string) => void;
  placeholder?: string;
}) {
  const theme = useWorldTheme();
  const [inputKey, setInputKey] = useState(0);
  const draft = useRef("");
  const actAsStop = Boolean(onStop) && disabled;

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
          color={theme.text}
          disabled={disabled}
          fontSize={14}
          height="100%"
          key={inputKey}
          onValueChange={(value: string) => {
            draft.current = value;
          }}
          placeholder={placeholder}
          placeholderStyle={{ color: theme.subtle }}
          width="100%"
        />
      </Container>
      <VrButton
        height={32}
        onClick={() => {
          if (actAsStop) {
            onStop?.();
            return;
          }
          send();
        }}
        width={32}
      >
        {actAsStop ? (
          <Square color={theme.text} height={14} width={14} />
        ) : (
          <Send color={theme.text} height={18} width={18} />
        )}
      </VrButton>
    </Container>
  );
}
