import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "chat-card",
    type: "registry:block",
    title: "Chat card",
    description: "First-person in-world chat for React Three Fiber and WebXR.",
    docs: `This example is a first-person studio with a mocked in-world chat card.

Add a route to src/features/assistant-card/page.tsx. On desktop, left click uses the card, right-drag looks around, WASD walks. On a Quest, Enter VR or AR — hands (pinch) and controllers (trigger/ray) drive the same card. Point a live transport at your own API when you have one.`,
    registryDependencies: [
      "@simple-ai/world-card",
      "@simple-ai/xr-button",
      "@simple-ai/xr-chat-input",
      "@simple-ai/xr-tool",
      "@simple-ai/xr-worked",
      "@simple-ai/xr-reasoning",
      "@simple-ai/xr-markdown",
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
        path: "look-controls.tsx",
        type: "registry:component",
        target: "src/features/assistant-card/look-controls.tsx",
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
