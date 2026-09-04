import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "worked",
    type: "registry:ui",
    title: "Worked",
    description: "Settled-turn fold for work before the final assistant text.",
    registryDependencies: ["collapsible"],
    files: [{ path: "worked.tsx", type: "registry:ui" }],
  },
  preview: "preview",
};

export default def;
