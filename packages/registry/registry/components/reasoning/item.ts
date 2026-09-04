import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "reasoning",
    type: "registry:ui",
    title: "Reasoning",
    description: "Quiet thinking row with markdown.",
    dependencies: ["streamdown"],
    registryDependencies: ["collapsible"],
    files: [{ path: "reasoning.tsx", type: "registry:ui" }],
  },
  preview: "preview",
};

export default def;
