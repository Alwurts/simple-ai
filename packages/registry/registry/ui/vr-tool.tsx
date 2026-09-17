"use client";

import { Container, Text } from "@react-three/uikit";
import { ChevronDown } from "@react-three/uikit-lucide";
import { useState } from "react";
import { toolTitle } from "@/components/ui/tool";
import { asciiSafe } from "@/components/ui/vr-markdown";
import { useWorldTheme } from "@/components/ui/world-card";

function dump(value: unknown) {
  if (value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    return asciiSafe(value);
  }
  try {
    return asciiSafe(JSON.stringify(value));
  } catch {
    return "";
  }
}

export function VrTool({
  defaultOpen = false,
  input,
  output,
  toolName,
}: {
  defaultOpen?: boolean;
  input?: unknown;
  output?: unknown;
  toolName: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const theme = useWorldTheme();
  const inText = dump(input);
  const outText = dump(output);
  return (
    <Container flexDirection="column" flexShrink={0} gap={2} width="100%">
      <Container
        alignItems="center"
        flexDirection="row"
        gap={4}
        onClick={() => setOpen((value) => !value)}
      >
        <ChevronDown
          color={theme.subtle}
          height={12}
          transformRotateZ={open ? 0 : 90}
          width={12}
        />
        <Text color={theme.subtle} fontSize={12}>
          {asciiSafe(toolTitle(toolName, input))}
        </Text>
      </Container>
      {open ? (
        <Container
          flexDirection="column"
          flexShrink={0}
          gap={2}
          paddingLeft={16}
          width="100%"
        >
          {inText ? (
            <>
              <Text color={theme.subtle} fontSize={11} fontWeight="semi-bold">
                Input
              </Text>
              <Text color={theme.subtle} fontSize={11}>
                {inText}
              </Text>
            </>
          ) : null}
          {outText ? (
            <>
              <Text color={theme.subtle} fontSize={11} fontWeight="semi-bold">
                Output
              </Text>
              <Text color={theme.subtle} fontSize={11}>
                {outText}
              </Text>
            </>
          ) : null}
        </Container>
      ) : null}
    </Container>
  );
}
