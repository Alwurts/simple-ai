import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "reasoning",
    type: "registry:ui",
    title: "Reasoning",
    description:
      "Collapsible thinking with duration and markdown.",
    dependencies: ["motion", "streamdown"],
    registryDependencies: ["collapsible"],
    files: [
      { path: "reasoning.tsx", type: "registry:ui" },
      { path: "shimmer.tsx", type: "registry:ui" },
    ],
  },
  preview: "preview",
};

export default def;
