import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "chat-voice-button",
    type: "registry:ui",
    title: "Chat Voice Button",
    description:
      "Record and transcribe into the chat input.",
    dependencies: ["sonner"],
    registryDependencies: ["input-group", "sonner"],
    files: [{ path: "chat-voice-button.tsx", type: "registry:ui" }],
  },
  preview: "preview",
};

export default def;
