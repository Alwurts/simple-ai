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
              {
                name: "money.test.ts",
                path: "/workspace/src/lib/money.test.ts",
              },
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
    "export { formatMinor, parseMinor } from './lib/money';\nexport { startAssistant } from './routes/assistant';\n",
  "/workspace/src/lib/money.ts": `export function formatMinor(amountMinor: number) {
  const sign = amountMinor < 0 ? "-" : "";
  const abs = Math.abs(Math.trunc(amountMinor));
  const dollars = Math.floor(abs / 100);
  const cents = abs % 100;
  return \`\${sign}\${dollars}.\${cents.toString().padStart(2, "0")}\`;
}

export function parseMinor(value: string): number {
  const trimmed = value.trim();
  const match = /^(-?)(\\d+)(?:\\.(\\d{1,2}))?$/.exec(trimmed);
  if (!match) {
    throw new Error(\`Invalid money: \${value}\`);
  }
  const sign = match[1] === "-" ? -1 : 1;
  const dollars = Number(match[2]);
  const cents = Number((match[3] ?? "0").padEnd(2, "0"));
  return sign * (dollars * 100 + cents);
}
`,
  "/workspace/src/lib/money.test.ts": `import { formatMinor, parseMinor } from "./money";

test("formatMinor keeps cents on 9_140_000", () => {
  expect(formatMinor(9_140_000)).toBe("91400.00");
});

test("parseMinor round-trip 91400.00", () => {
  expect(parseMinor("91400.00")).toBe(9_140_000);
});
`,
  "/workspace/src/lib/utils.ts":
    "export function cn(...parts: string[]) {\n  return parts.filter(Boolean).join(' ');\n}\n",
  "/workspace/src/routes/assistant.tsx":
    "export function AssistantRoute() {\n  return <FullScreenChat />;\n}\n",
  "/workspace/docs/readme.md":
    "# Assistant workspace\n\nMock files for the gallery file explorer.\n",
  "/workspace/data/open-invoices.csv":
    "invoice_id,customer,balance\nINV-1042,Northside,125000\n",
};
