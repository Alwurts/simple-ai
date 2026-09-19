"use client";

import { Container, Text } from "@react-three/uikit";
import { VrChatInput } from "@/components/ui/vr-chat-input";
import { VrMarkdown } from "@/components/ui/vr-markdown";
import { useWorldTheme } from "@/components/ui/world-card";
import { VrDemoCanvas } from "./vr-demo-canvas";

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
        <VrMarkdown markdown="You are looking at a VR chat card. Drag the handle to move it. Pinch a corner to resize." />
      </Container>
      <VrChatInput onSubmit={() => undefined} />
    </>
  );
}

export default function WorldCardDemoScene() {
  return (
    <VrDemoCanvas size={{ h: 280, w: 320 }}>
      <MiniChat />
    </VrDemoCanvas>
  );
}
