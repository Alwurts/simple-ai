import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "tool",
    type: "registry:ui",
    title: "Tool",
    description:
      "Collapsible tool-call card — status, parameters, and JSON output.",
    dependencies: ["ai", "shiki"],
    registryDependencies: ["badge", "button", "collapsible"],
    files: [
      { path: "tool.tsx", type: "registry:ui" },
      { path: "code-block.tsx", type: "registry:ui" },
    ],
  },
  preview: "preview",
};

export default def;
