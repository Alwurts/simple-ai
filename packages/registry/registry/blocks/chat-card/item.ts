import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "chat-card",
    type: "registry:block",
    title: "Chat card",
    description: "VR chat for React Three Fiber.",
    docs: `This example is a mocked VR chat card.

Add a route to src/features/assistant-card/page.tsx. On desktop, click the card, drag the handle to move, and pinch corners to resize. On a Quest, Enter VR or AR — hands (pinch) and controllers (trigger/ray) drive the same card. Point a live transport at your own API when you have one.`,
    registryDependencies: [
      "@simple-ai/world-card",
      "@simple-ai/vr-button",
      "@simple-ai/vr-chat-input",
      "@simple-ai/vr-tool",
      "@simple-ai/vr-worked",
      "@simple-ai/vr-reasoning",
      "@simple-ai/vr-markdown",
    ],
    dependencies: [
      "@react-three/uikit",
      "@react-three/uikit-lucide",
      "@react-three/xr",
    ],
    meta: { iframeHeight: 800, fullBleed: true },
    files: [
      {
        path: "page.tsx",
        type: "registry:component",
        target: "src/features/assistant-card/page.tsx",
      },
      {
        path: "scene.tsx",
        type: "registry:component",
        target: "src/features/assistant-card/scene.tsx",
      },
      {
        path: "xr-store.ts",
        type: "registry:lib",
        target: "src/features/assistant-card/xr-store.ts",
      },
      {
        path: "chat-body.tsx",
        type: "registry:component",
        target: "src/features/assistant-card/chat-body.tsx",
      },
      {
        path: "speaking-orb.tsx",
        type: "registry:component",
        target: "src/features/assistant-card/speaking-orb.tsx",
      },
      {
        path: "mock-messages.ts",
        type: "registry:lib",
        target: "src/features/assistant-card/mock-messages.ts",
      },
      {
        path: "hud.tsx",
        type: "registry:component",
        target: "src/features/assistant-card/hud.tsx",
      },
    ],
  },
  preview: "page",
};

export default def;
