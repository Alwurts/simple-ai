export interface WorkspaceFileNode {
  name: string;
  path: string;
  children?: WorkspaceFileNode[];
}

/** Gallery workspace tree for the assistant sandbox container. */
export const MOCK_WORKSPACE_TREE: WorkspaceFileNode[] = [
  {
    name: "workspace",
    path: "/workspace",
    children: [
      {
        name: "src",
        path: "/workspace/src",
        children: [
          { name: "index.ts", path: "/workspace/src/index.ts" },
          {
            name: "lib",
            path: "/workspace/src/lib",
            children: [
              { name: "money.ts", path: "/workspace/src/lib/money.ts" },
              { name: "utils.ts", path: "/workspace/src/lib/utils.ts" },
            ],
          },
          {
            name: "routes",
            path: "/workspace/src/routes",
            children: [
              {
                name: "assistant.tsx",
                path: "/workspace/src/routes/assistant.tsx",
              },
            ],
          },
        ],
      },
      {
        name: "docs",
        path: "/workspace/docs",
        children: [
          { name: "readme.md", path: "/workspace/docs/readme.md" },
          { name: "onboarding.pdf", path: "/workspace/docs/onboarding.pdf" },
        ],
      },
      {
        name: "data",
        path: "/workspace/data",
        children: [
          {
            name: "open-invoices.csv",
            path: "/workspace/data/open-invoices.csv",
          },
          { name: "customers.docx", path: "/workspace/data/customers.docx" },
        ],
      },
    ],
  },
];

export const MOCK_WORKSPACE_FILE_CONTENT: Record<string, string> = {
  "/workspace/src/index.ts":
    "export { startAssistant } from './routes/assistant';\n",
  "/workspace/src/lib/money.ts":
    "export function formatMinor(amount: number) {\n  return (amount / 100).toFixed(2);\n}\n",
  "/workspace/src/lib/utils.ts":
    "export function cn(...parts: string[]) {\n  return parts.filter(Boolean).join(' ');\n}\n",
  "/workspace/src/routes/assistant.tsx":
    "export function AssistantRoute() {\n  return <FullScreenChat />;\n}\n",
  "/workspace/docs/readme.md":
    "# Assistant workspace\n\nMock files for the gallery file explorer.\n",
  "/workspace/data/open-invoices.csv":
    "invoice_id,customer,balance\nINV-1042,Northside,125000\n",
};
