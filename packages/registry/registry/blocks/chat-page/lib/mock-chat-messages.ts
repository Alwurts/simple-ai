import { createChat } from "@shadcn/helpers/ai-sdk";
import type { UIMessage } from "ai";
import type { AIDataPart, AIMetadata } from "./ai-types";

export type GalleryChatMessage = UIMessage<AIMetadata, AIDataPart>;

const FORMAT_MINOR_SRC = `export function formatMinor(amount: number) {
  return (amount / 100).toFixed(2);
}
`;

const FORMAT_MINOR_INT = `export function formatMinor(amountMinor: number) {
  const sign = amountMinor < 0 ? "-" : "";
  const abs = Math.abs(Math.trunc(amountMinor));
  const dollars = Math.floor(abs / 100);
  const cents = abs % 100;
  return \`\${sign}\${dollars}.\${cents.toString().padStart(2, "0")}\`;
}
`;

const PARSE_MINOR_SRC = `export function parseMinor(value: string): number {
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
`;

const FORMAT_MINOR_FIXED = `${FORMAT_MINOR_INT}
${PARSE_MINOR_SRC}`;

const galleryChat = createChat<GalleryChatMessage>()
  .user(
    "formatMinor is dropping cents on large invoice totals. Find and fix it."
  )
  .assistant(({ writer }) => {
    writer.stepStart();
    writer.reasoning(
      `The report is lost cents on large invoice totals, which usually means we are formatting minor units with floating point.

I will search for formatMinor, read the helper and every call site, then run the money tests before touching anything. If the tests already pin 9_140_000, that is the number I will use as the reproduction. I should not invent a new API until I know whether callers pass cents or dollars.`
    );
    writer
      .tool("grep", {
        dynamic: true,
        input: {
          pattern: "formatMinor",
          path: "/workspace/src",
        },
      })
      .sleep(1300)
      .output({
        matches: [
          {
            path: "/workspace/src/lib/money.ts",
            line: 1,
            text: "export function formatMinor(amount: number) {",
          },
          {
            path: "/workspace/src/lib/money.ts",
            line: 2,
            text: "  return (amount / 100).toFixed(2);",
          },
          {
            path: "/workspace/src/index.ts",
            line: 1,
            text: "export { formatMinor } from './lib/money';",
          },
        ],
      });
    writer
      .tool("read", {
        dynamic: true,
        input: { path: "/workspace/src/lib/money.ts" },
      })
      .sleep(1200)
      .output({
        path: "/workspace/src/lib/money.ts",
        content: FORMAT_MINOR_SRC,
      });
    writer
      .tool("read", {
        dynamic: true,
        input: { path: "/workspace/src/index.ts" },
      })
      .sleep(1000)
      .output({
        path: "/workspace/src/index.ts",
        content: "export { formatMinor } from './lib/money';\n",
      });
    writer.stepStart();
    writer.reasoning(
      `The implementation is a one-liner: \`(amount / 100).toFixed(2)\`. That looks harmless and is the classic IEEE-754 trap.

\`9_140_000 / 100\` is not 91400 in binary floating point, so \`toFixed(2)\` can emit \`91399.99\`. Call sites only re-export the helper, so a local change in money.ts is enough. Next I will run the existing test file to confirm it already covers this total before I patch.`
    );
    writer
      .tool("bash", {
        dynamic: true,
        input: { command: "pnpm test -- src/lib/money.test.ts" },
      })
      .sleep(2200)
      .output(
        `FAIL  src/lib/money.test.ts
  × formatMinor › keeps cents on 9_140_000  4ms

    Expected: "91400.00"
    Received: "91399.99"

Test Files  1 failed (1)
      1 failed
`
      );
    writer.stepStart();
    writer.reasoning(
      `The failing case is exactly the total from the bug report: expected \`91400.00\`, received \`91399.99\`.

I will stop dividing as a float. Truncate to an integer number of cents, split dollars with \`Math.floor(abs / 100)\` and cents with \`abs % 100\`, then pad cents to two digits. Negative balances need the sign applied after the abs split so \`-50\` stays \`-0.50\` and not \`0.-50\`. Then I re-run the same file.`
    );
    writer.sleep(700);
    writer
      .tool("edit", {
        dynamic: true,
        input: {
          path: "/workspace/src/lib/money.ts",
          old_string: FORMAT_MINOR_SRC.trim(),
          new_string: FORMAT_MINOR_INT.trim(),
        },
      })
      .sleep(1700)
      .output({ path: "/workspace/src/lib/money.ts", ok: true });
    writer
      .tool("bash", {
        dynamic: true,
        input: { command: "pnpm test -- src/lib/money.test.ts" },
      })
      .sleep(2000)
      .output(
        `PASS  src/lib/money.test.ts
  ✓ formatMinor › keeps cents on 9_140_000
  ✓ formatMinor › negative balances

Test Files  1 passed (1)
      2 passed
`
      );
    writer.stepStart();
    writer.reasoning(
      "Tests are green, including the negative-balance case. I will summarize the integer split, show the new helper, and leave invoice CSV formatting alone unless they ask. No other call site in src/ was doing its own toFixed."
    );
    writer.text(
      `The helper was dividing minor units as a float and then calling \`toFixed(2)\`. That is fine for small values and wrong once the integer is large enough that \`amount / 100\` is not representable.

**What I changed**

\`src/lib/money.ts\` now splits dollars and cents with integer math:

\`\`\`ts
export function formatMinor(amountMinor: number) {
  const sign = amountMinor < 0 ? "-" : "";
  const abs = Math.abs(Math.trunc(amountMinor));
  const dollars = Math.floor(abs / 100);
  const cents = abs % 100;
  return \`\${sign}\${dollars}.\${cents.toString().padStart(2, "0")}\`;
}
\`\`\`

**Checks**

- \`pnpm test -- src/lib/money.test.ts\` was failing on \`9_140_000\` (\`91399.99\` vs \`91400.00\`).
- Same file is green after the patch, including a negative-balance case.

Call sites in \`src/index.ts\` still re-export \`formatMinor\`. I did not touch invoice formatting yet — say if you want that wired through the same helper.`
    );
  })
  .user(
    "Add parseMinor and export it from the package entry. Cover round-trips in tests."
  )
  .assistant(({ writer }) => {
    writer.stepStart();
    writer.data({
      type: "data-plan",
      data: {
        entries: [
          {
            content: "Read money.ts and the existing test file",
            status: "completed",
          },
          {
            content: "Add parseMinor next to formatMinor",
            status: "pending",
          },
          { content: "Re-export from src/index.ts", status: "pending" },
          { content: "Add round-trip tests and run them", status: "pending" },
        ],
      },
    });
    writer.reasoning(
      `parseMinor should be the inverse of the integer formatter we just landed, not a second float path.

I will read the current helper and the test file, add the parser next to formatMinor, re-export it from the package entry, and add a round-trip on 91400.00 plus a junk-input reject. Fractions with one digit should pad (\`"12.5"\` → 1250). More than two decimal places should throw until they ask for rounding.`
    );
    writer
      .tool("read", {
        dynamic: true,
        input: { path: "/workspace/src/lib/money.ts" },
      })
      .sleep(1200)
      .output({
        path: "/workspace/src/lib/money.ts",
        content: FORMAT_MINOR_INT,
      });
    writer
      .tool("glob", {
        dynamic: true,
        input: { pattern: "**/*money*", path: "/workspace" },
      })
      .sleep(1000)
      .output({
        files: [
          "/workspace/src/lib/money.ts",
          "/workspace/src/lib/money.test.ts",
        ],
      });
    writer
      .tool("read", {
        dynamic: true,
        input: { path: "/workspace/src/lib/money.test.ts" },
      })
      .sleep(1100)
      .output({
        path: "/workspace/src/lib/money.test.ts",
        content: `import { formatMinor } from "./money";

test("formatMinor keeps cents on 9_140_000", () => {
  expect(formatMinor(9_140_000)).toBe("91400.00");
});
`,
      });
    writer.stepStart();
    writer.reasoning(
      `The helper is still format-only and the test file only covers formatMinor. I will append parseMinor in money.ts, switch the index re-export to named \`formatMinor, parseMinor\`, and extend the test import.

Round-trip on \`"91400.00"\` is the case that failed last turn. I will also reject strings that are not \`(-?)digits(.digits{1,2})?\` so we do not silently drop extra fractional digits.`
    );
    writer.text(
      `I'll add \`parseMinor\` next to the integer formatter, re-export it from \`src/index.ts\`, and cover a round-trip on \`91400.00\`. That writes three files — approve the patch to apply it.`
    );
    writer.tool("edit", {
      dynamic: true,
      needsApproval: true,
      input: {
        path: "/workspace/src/lib/money.ts",
        old_string: FORMAT_MINOR_INT.trim(),
        new_string: FORMAT_MINOR_FIXED.trim(),
      },
      output: { path: "/workspace/src/lib/money.ts", ok: true },
    });
  })
  .assistant(({ writer, toolCall }) => {
    writer.stepStart();
    if (!toolCall?.approved) {
      writer.text(
        "Left `money.ts` unchanged. Say if you want a different patch."
      );
      return;
    }
    writer.reasoning(
      "Patch is approved. I will re-export parseMinor, extend the test import, and run the file."
    );
    writer
      .tool("edit", {
        dynamic: true,
        input: {
          path: "/workspace/src/index.ts",
          old_string: "export { formatMinor } from './lib/money';",
          new_string: "export { formatMinor, parseMinor } from './lib/money';",
        },
      })
      .sleep(1300)
      .output({ path: "/workspace/src/index.ts", ok: true });
    writer
      .tool("edit", {
        dynamic: true,
        input: {
          path: "/workspace/src/lib/money.test.ts",
          old_string: `import { formatMinor } from "./money";`,
          new_string: `import { formatMinor, parseMinor } from "./money";`,
        },
      })
      .sleep(1200)
      .output({ path: "/workspace/src/lib/money.test.ts", ok: true });
    writer
      .tool("bash", {
        dynamic: true,
        input: { command: "pnpm test -- src/lib/money.test.ts" },
      })
      .sleep(2300)
      .output(
        `PASS  src/lib/money.test.ts
  ✓ formatMinor › keeps cents on 9_140_000
  ✓ formatMinor › negative balances
  ✓ parseMinor › round-trip 91400.00
  ✓ parseMinor › rejects junk

Test Files  1 passed (1)
      4 passed
`
      );
    writer.stepStart();
    writer.text(
      `\`parseMinor\` now lives next to \`formatMinor\` and the package entry re-exports both.

\`\`\`ts
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
\`\`\`

**Files**

- \`src/lib/money.ts\` — parser + the integer formatter from the last turn
- \`src/index.ts\` — \`export { formatMinor, parseMinor }\`
- \`src/lib/money.test.ts\` — round-trip on \`91400.00\`, plus a junk-input reject

\`pnpm test -- src/lib/money.test.ts\` is 4/4. One- and two-digit fractions pad to cents (\`"12.5"\` → \`1250\`). Values with more than two decimal places still throw — say if you want bankers rounding instead.`
    );
  });

const ASSISTANT_RESPONSE_MS = [26_800];

let assistantIndex = -1;

export const initialGalleryMessages = galleryChat.get().map((message) => {
  if (message.role !== "assistant") {
    return message;
  }
  assistantIndex += 1;
  return {
    ...message,
    metadata: {
      createdAt: message.metadata?.createdAt ?? "2026-06-24T12:00:00.000Z",
      status: message.metadata?.status ?? "success",
      ...message.metadata,
      responseTime:
        message.metadata?.responseTime ?? ASSISTANT_RESPONSE_MS[assistantIndex],
    },
  };
});

export const galleryChatTransport = galleryChat.transport({
  delayMs: 80,
  fallback: ({ writer, messages }) => {
    const assistantTurns = messages.filter(
      (message) => message.role === "assistant"
    ).length;
    const variants = [
      () => {
        writer.stepStart();
        writer.reasoning(
          "They want a reminder draft, not another formatter change. I should pull the open-invoices file so the copy uses a real customer, amount, and due date, then format the minor units with the helper we just patched so the dollars match 7_500_000."
        );
        writer
          .tool("grep", {
            dynamic: true,
            input: {
              pattern: "Northside|Bayview",
              path: "/workspace/data",
            },
          })
          .sleep(1300)
          .output({
            matches: [
              {
                path: "/workspace/data/open-invoices.csv",
                line: 2,
                text: "INV-1042,Northside Distributors,7500000",
              },
            ],
          });
        writer
          .tool("read", {
            dynamic: true,
            input: { path: "/workspace/data/open-invoices.csv" },
          })
          .sleep(1200)
          .output({
            path: "/workspace/data/open-invoices.csv",
            content:
              "invoice_id,customer,balance_minor,due\nINV-1042,Northside Distributors,7500000,2026-06-24\nINV-1038,Bayview Supply,1240000,2026-06-26\n",
          });
        writer.stepStart();
        writer.reasoning(
          "INV-1042 is Northside Distributors, 7_500_000 minor, due 24 Jun. That is the $75,000 note. I will run formatMinor once so the draft does not hard-code a string that can drift from the helper, then write the email."
        );
        writer
          .tool("bash", {
            dynamic: true,
            input: {
              command:
                "pnpm exec tsx -e \"import { formatMinor } from './src/lib/money.ts'; console.log(formatMinor(7500000))\"",
            },
          })
          .sleep(1600)
          .output("75000.00\n");
        writer.stepStart();
        writer.text(
          `Here is a collection note you can send as-is:

> Hi Northside team —
>
> Invoice **INV-1042** still has an open balance of **$75,000.00**, due Tuesday 24 Jun. If payment is already on the way, ignore this; otherwise reply with an ETA and I will hold the reminder.
>
> Thanks,
> Receivables

I used \`formatMinor(7_500_000)\` so the amount matches the helper we just patched. I can swap this to Bayview (INV-1038, $12,400.00, due Thursday) or turn it into a template in \`src/lib/money.ts\` if you want it reused.`
        );
      },
      () => {
        writer.stepStart();
        writer.data({
          type: "data-plan",
          data: {
            entries: [
              {
                content: "Find invoice formatting call sites",
                status: "completed",
              },
              { content: "Read the current helper", status: "completed" },
              {
                content: "Sketch a shared format for CSV export",
                status: "completed",
              },
            ],
          },
        });
        writer.reasoning(
          "They asked about reuse. I will search for formatMinor, balanceMinor, and leftover toFixed(2) call sites, then decide whether a CSV helper belongs in money.ts or utils.ts. I should not rewrite open-invoices.csv by hand if nothing in src/ is formatting rows yet."
        );
        writer
          .tool("grep", {
            dynamic: true,
            input: {
              pattern: "formatMinor|balanceMinor|toFixed\\(2\\)",
              path: "/workspace/src",
            },
          })
          .sleep(1400)
          .output({
            matches: [
              {
                path: "/workspace/src/lib/money.ts",
                line: 1,
                text: "export function formatMinor(amountMinor: number) {",
              },
              {
                path: "/workspace/src/index.ts",
                line: 1,
                text: "export { formatMinor, parseMinor } from './lib/money';",
              },
            ],
          });
        writer
          .tool("read", {
            dynamic: true,
            input: { path: "/workspace/src/lib/utils.ts" },
          })
          .sleep(1000)
          .output({
            path: "/workspace/src/lib/utils.ts",
            content:
              "export function cn(...parts: string[]) {\n  return parts.filter(Boolean).join(' ');\n}\n",
          });
        writer.stepStart();
        writer.reasoning(
          "utils.ts is class-name joining. Money formatting should stay next to formatMinor. Tests are the next check so I do not propose a csvBalance helper on top of a red suite. If they want the helper I can add it in a follow-up with a fixture against open-invoices.csv."
        );
        writer
          .tool("bash", {
            dynamic: true,
            input: { command: "pnpm test -- src/lib/money.test.ts" },
          })
          .sleep(1800)
          .output(
            `PASS  src/lib/money.test.ts
  ✓ 4 passed
`
          );
        writer.stepStart();
        writer.text(
          `Nothing else in \`src/\` formats money yet — only the helper and the re-export. A CSV row can go through the same functions:

\`\`\`ts
import { formatMinor, parseMinor } from "./lib/money";

export function csvBalance(minor: number) {
  return formatMinor(minor);
}
\`\`\`

I would keep that next to \`formatMinor\` rather than in \`utils.ts\` (\`cn\` is class names, not money). Tests are still green. Want me to add \`csvBalance\` and a fixture against \`open-invoices.csv\`?`
        );
      },
      () => {
        writer.stepStart();
        writer.reasoning(
          "This looks like a restock question, not more money-helper work. I will glob and grep for inventory, stock, SKU, and reorder before I invent a module. If the workspace has none of that, I should say so and offer a small inventory.ts rather than pretending the data lives in money.ts."
        );
        writer
          .tool("glob", {
            dynamic: true,
            input: {
              pattern: "**/*{inventory,stock,sku}*",
              path: "/workspace",
            },
          })
          .sleep(1100)
          .output({ files: [] });
        writer
          .tool("grep", {
            dynamic: true,
            input: {
              pattern: "reorder|onHand|SKU",
              path: "/workspace",
            },
          })
          .sleep(1300)
          .output({ matches: [] });
        writer.stepStart();
        writer.reasoning(
          "No inventory files and no reorder/SKU hits. I will list src/lib to confirm what is actually there, then stop. Offering inventory.ts with a CL-1180 fixture is fine; wiring it into money.ts is not."
        );
        writer
          .tool("bash", {
            dynamic: true,
            input: { command: "ls /workspace/src/lib" },
          })
          .sleep(900)
          .output("money.ts\nmoney.test.ts\nutils.ts\n");
        writer.stepStart();
        writer.text(
          `There is no inventory module in this workspace — \`src/lib\` is \`money.ts\`, its test, and \`utils.ts\`.

If you want restock suggestions, the next slice is a small \`src/lib/inventory.ts\` that reads on-hand vs reorder point and a test around **CL-1180** (zero on-hand, reorder 12). I can add that, or stay on the money helpers.`
        );
      },
    ] as const;
    const writeFallback =
      variants[assistantTurns % variants.length] ?? variants[0];
    writeFallback();
  },
});
