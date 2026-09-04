import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "worked",
    type: "registry:ui",
    title: "Worked",
    description: "Fold for work before the last assistant text.",
    registryDependencies: ["collapsible"],
    files: [{ path: "worked.tsx", type: "registry:ui" }],
  },
  preview: "preview",
};

export default def;
