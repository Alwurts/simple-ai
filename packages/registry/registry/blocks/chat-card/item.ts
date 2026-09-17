import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "chat-card",
    type: "registry:block",
    title: "Chat card",
    description: "In-world chat for React Three Fiber and WebXR.",
    docs: `This card ships a mocked transcript so the gallery and a fresh install work without a model.

Add a route to src/features/assistant-card/page.tsx. Enter VR or AR from a WebXR browser (Quest). Point a live transport at your own API when you have one.`,
    registryDependencies: [
      "@simple-ai/world-card",
      "@simple-ai/tool",
      "@simple-ai/worked",
    ],
    dependencies: [
      "@react-three/drei",
      "@react-three/uikit",
      "@react-three/uikit-lucide",
      "@react-three/xr",
    ],
    meta: { iframeHeight: 720, fullBleed: true },
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
        path: "enter-xr.tsx",
        type: "registry:component",
        target: "src/features/assistant-card/enter-xr.tsx",
      },
    ],
  },
  preview: "page",
};

export default def;
