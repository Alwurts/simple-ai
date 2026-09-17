"use client";

import { Text } from "@react-three/uikit";
import { useState } from "react";
import { useWorldTheme } from "@/components/ui/world-card";
import { XrChatInput } from "@/components/ui/xr-chat-input";
import { asciiSafe } from "@/components/ui/xr-markdown";
import { XrDemoCanvas } from "./xr-demo-canvas";

function Demo() {
  const theme = useWorldTheme();
  const [last, setLast] = useState("Type and send.");
  return (
    <>
      <Text color={theme.text} fontSize={13}>
        {asciiSafe(last)}
      </Text>
      <XrChatInput onSubmit={setLast} placeholder="Ask in world space" />
    </>
  );
}

export default function XrChatInputDemoScene() {
  return (
    <XrDemoCanvas size={{ h: 140, w: 320 }}>
      <Demo />
    </XrDemoCanvas>
  );
}
