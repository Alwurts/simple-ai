"use client";

import { Container, Text } from "@react-three/uikit";
import { ChevronDown } from "@react-three/uikit-lucide";
import { useRef, useState } from "react";
import { asciiSafe } from "@/components/ui/vr-markdown";
import { useWorldTheme } from "@/components/ui/world-card";

export function VrReasoning({
  isStreaming = false,
  text,
}: {
  isStreaming?: boolean;
  text: string;
}) {
  const [userOpen, setUserOpen] = useState<boolean | null>(null);
  const streamed = useRef(isStreaming);
  if (isStreaming) {
    streamed.current = true;
  }
  const open = userOpen ?? (isStreaming || streamed.current);
  const theme = useWorldTheme();
  return (
    <Container flexDirection="column" flexShrink={0} gap={2} width="100%">
      <Container
        alignItems="center"
        flexDirection="row"
        gap={4}
        onClick={() => setUserOpen(!open)}
      >
        <ChevronDown
          color={theme.subtle}
          height={12}
          transformRotateZ={open ? 0 : 90}
          width={12}
        />
        <Text color={theme.subtle} fontSize={12}>
          {isStreaming ? "Reasoning..." : "Reasoning"}
        </Text>
      </Container>
      {open ? (
        <Text color={theme.subtle} fontSize={12}>
          {asciiSafe(text)}
        </Text>
      ) : null}
    </Container>
  );
}
