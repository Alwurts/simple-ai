"use client";

import { Container, Text } from "@react-three/uikit";
import { useWorldTheme } from "@/components/ui/world-card";
import { XrChatInput } from "@/components/ui/xr-chat-input";
import { XrMarkdown } from "@/components/ui/xr-markdown";
import { XrDemoCanvas } from "./xr-demo-canvas";

function MiniChat() {
  const theme = useWorldTheme();
  return (
    <>
      <Text color={theme.text} fontSize={14}>
        Assistant
      </Text>
      <Container
        backgroundColor={theme.border}
        flexShrink={0}
        height={1}
        width="100%"
      />
      <Container
        flexDirection="column"
        flexGrow={1}
        gap={8}
        minHeight={0}
        overflow="scroll"
        width="100%"
      >
        <Container
          alignSelf="flex-end"
          backgroundColor={theme.bubble}
          borderRadius={10}
          flexShrink={0}
          maxWidth="80%"
          padding={8}
        >
          <Text color={theme.text} fontSize={13}>
            What am I looking at?
          </Text>
        </Container>
        <XrMarkdown markdown="You are looking at an in-world chat card. Drag the handle to move it. Pinch a corner to resize." />
      </Container>
      <XrChatInput onSubmit={() => undefined} />
    </>
  );
}

export default function WorldCardDemoScene() {
  return (
    <XrDemoCanvas size={{ h: 280, w: 320 }}>
      <MiniChat />
    </XrDemoCanvas>
  );
}
