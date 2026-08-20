import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "app-shell",
    type: "registry:block",
    title: "App shell",
    description:
      "Sample layout using the shell.",
    registryDependencies: ["button", "empty", "sidebar", "@simple-ai/shell"],
    meta: { iframeHeight: 720 },
    files: [
      {
        path: "page.tsx",
        type: "registry:page",
        target: "src/routes/dashboard.tsx",
      },
      {
        path: "components/app-sidebar.tsx",
        type: "registry:component",
        target: "src/features/app-shell/components/app-sidebar.tsx",
      },
    ],
  },
  preview: "page",
};

export default def;
