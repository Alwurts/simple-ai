"use client";

import { Container, Text } from "@react-three/uikit";
import { useEffect, useState } from "react";
import { asciiSafe } from "@/components/ui/vr-markdown";
import { VrMessageScroller } from "@/components/ui/vr-message-scroller";
import { useWorldTheme } from "@/components/ui/world-card";
import { VrDemoCanvas } from "./vr-demo-canvas";

const HISTORY: Array<{ role: "assistant" | "user"; text: string }> = [
  { role: "user", text: "What am I looking at?" },
  { role: "assistant", text: "A VR chat card. Drag the handle to move it." },
  { role: "user", text: "Make the hole 8mm." },
  { role: "assistant", text: "Calling cad_edit with diameter_mm 8." },
  { role: "user", text: "Keep the fillet." },
  {
    role: "assistant",
    text: "Fillet stays at 1 mm. Rebuild when you are ready.",
  },
  { role: "user", text: "Show the live edge." },
];

const WORDS =
  "The hole is now 8 mm. Scroll up to read, then jump back to the live edge.".split(
    " "
  );

function Bubble({ from, text }: { from: "assistant" | "user"; text: string }) {
  const theme = useWorldTheme();
  const mine = from === "user";
  return (
    <Container
      alignSelf={mine ? "flex-end" : "flex-start"}
      backgroundColor={mine ? theme.bubble : undefined}
      borderRadius={10}
      flexShrink={0}
      maxWidth={mine ? "80%" : "100%"}
      padding={mine ? 8 : 0}
      width={mine ? undefined : "100%"}
    >
      <Text color={theme.text} fontSize={13}>
        {asciiSafe(text)}
      </Text>
    </Container>
  );
}

function Demo() {
  const theme = useWorldTheme();
  const [count, setCount] = useState(1);
  useEffect(() => {
    const id = window.setInterval(() => {
      setCount((value) => (value >= WORDS.length ? 1 : value + 1));
    }, 220);
    return () => window.clearInterval(id);
  }, []);
  const tail = WORDS.slice(0, count).join(" ");
  return (
    <>
      <Text color={theme.text} fontSize={14}>
        Live edge
      </Text>
      <VrMessageScroller autoScroll>
        {HISTORY.map((row) => (
          <Bubble from={row.role} key={row.text} text={row.text} />
        ))}
        <Bubble from="assistant" text={tail} />
      </VrMessageScroller>
    </>
  );
}

export default function VrMessageScrollerDemoScene() {
  return (
    <VrDemoCanvas size={{ h: 280, w: 320 }}>
      <Demo />
    </VrDemoCanvas>
  );
}
