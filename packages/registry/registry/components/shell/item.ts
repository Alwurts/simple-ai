import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "shell",
    type: "registry:ui",
    title: "Shell",
    description: "Sidebar, header, and main content.",
    registryDependencies: ["button", "sidebar"],
    meta: { fullBleed: true, iframeHeight: 720 },
    files: [{ path: "shell.tsx", type: "registry:ui" }],
  },
  preview: "preview",
};

export default def;
