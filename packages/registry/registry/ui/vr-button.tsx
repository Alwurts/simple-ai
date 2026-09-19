"use client";

import { Container, Text } from "@react-three/uikit";
import type { ReactNode } from "react";
import { useWorldTheme } from "@/components/ui/world-card";

export function VrButton({
  children,
  disabled = false,
  grow = false,
  height = 32,
  label,
  onClick,
  width,
}: {
  children?: ReactNode;
  disabled?: boolean;
  grow?: boolean;
  height?: number;
  label?: string;
  onClick?: () => void;
  width?: number;
}) {
  const theme = useWorldTheme();
  return (
    <Container
      active={{ backgroundColor: theme.pressed }}
      alignItems="center"
      backgroundColor={theme.muted}
      borderRadius={6}
      flexGrow={grow ? 1 : 0}
      flexShrink={0}
      height={height}
      hover={{ backgroundColor: theme.hover }}
      justifyContent="center"
      onClick={() => {
        if (!disabled) {
          onClick?.();
        }
      }}
      opacity={disabled ? 0.4 : 1}
      width={grow ? undefined : width}
    >
      {children ?? (
        <Text color={theme.text} fontSize={14}>
          {label ?? ""}
        </Text>
      )}
    </Container>
  );
}
