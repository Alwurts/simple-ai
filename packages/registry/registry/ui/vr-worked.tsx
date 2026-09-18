"use client";

import { Container, Text } from "@react-three/uikit";
import { ChevronDown } from "@react-three/uikit-lucide";
import { type ReactNode, useState } from "react";
import { workedLabel } from "@/components/ui/worked";
import { useWorldTheme } from "@/components/ui/world-card";

export function VrWorked({
  children,
  duration,
  isStreaming = false,
}: {
  children: ReactNode;
  duration?: number;
  isStreaming?: boolean;
}) {
  const [userOpen, setUserOpen] = useState<boolean | null>(null);
  const open = userOpen ?? isStreaming;
  const theme = useWorldTheme();
  return (
    <Container flexDirection="column" flexShrink={0} gap={4} width="100%">
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
          {workedLabel({ duration, isStreaming })}
        </Text>
      </Container>
      {open ? (
        <Container flexDirection="column" flexShrink={0} gap={4} width="100%">
          {children}
        </Container>
      ) : null}
    </Container>
  );
}
