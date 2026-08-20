import { createChat } from "@shadcn/helpers/ai-sdk";
import type { UIMessage } from "ai";
import type { AIDataPart, AIMetadata } from "./ai-types";

export type GalleryChatMessage = UIMessage<AIMetadata, AIDataPart>;

const galleryChat = createChat<GalleryChatMessage>()
  .user("Who owes us money this week?")
  .assistant(({ writer }) => {
    writer.reasoning(
      "The user wants open receivables due this week. I'll query finalized invoices with balance > 0 and due dates in the current week, then summarize by customer."
    );
    writer
      .tool("list_open_invoices", {
        dynamic: true,
        input: {
          dueWithinDays: 7,
          status: "finalized",
        },
      })
      .sleep(400)
      .output({
        count: 3,
        totalBalanceMinor: 9_140_000,
        invoices: [
          {
            id: "INV-1042",
            customer: "Northside Distributors",
            balanceMinor: 7_500_000,
            dueDate: "2026-06-24",
          },
          {
            id: "INV-1038",
            customer: "Bayview Supply",
            balanceMinor: 1_240_000,
            dueDate: "2026-06-26",
          },
          {
            id: "INV-1035",
            customer: "Lakeside Foods",
            balanceMinor: 420_000,
            dueDate: "2026-06-27",
          },
        ],
      });
    writer.text(`Three customers have open balances due this week:

- **Northside Distributors** — $75,000 on INV-1042 (due Tuesday)
- **Bayview Supply** — $12,400 on INV-1038 (due Thursday)
- **Lakeside Foods** — $4,200 on INV-1035 (due Friday)

Want me to draft collection reminders?`);
  })
  .user("Show low stock in the main warehouse.")
  .assistant(({ writer }) => {
    writer.data({
      type: "data-plan",
      data: {
        entries: [
          {
            content: "Load warehouse context for Main DC",
            status: "completed",
          },
          { content: "Query SKUs below reorder point", status: "completed" },
          { content: "Format results as a table", status: "completed" },
        ],
      },
    });
    writer.reasoning(
      "Inventory list filtered to Main DC. I'll rank by severity (zero on-hand first) and include reorder quantities."
    );
    writer
      .tool("list_inventory", {
        dynamic: true,
        input: {
          warehouseId: "main-dc",
          belowReorderPoint: true,
        },
      })
      .sleep(400)
      .output({
        warehouse: "Main DC",
        skuCount: 12,
        sample: [
          { sku: "WD-4420", onHand: 4, reorderPoint: 24 },
          { sku: "CL-1180", onHand: 0, reorderPoint: 12 },
          { sku: "PK-9031", onHand: 8, reorderPoint: 40 },
        ],
      });
    writer.text(`12 SKUs are below reorder point at **Main DC**:

| SKU | On hand | Reorder |
| --- | --- | --- |
| WD-4420 | 4 | 24 |
| CL-1180 | 0 | 12 |
| PK-9031 | 8 | 40 |

I can open the inventory list filtered to these items.`);
  });

export const initialGalleryMessages = galleryChat.get();

export const galleryChatTransport = galleryChat.transport({
  delayMs: 25,
  fallback: ({ writer, messages }) => {
    const assistantTurns = messages.filter(
      (message) => message.role === "assistant"
    ).length;
    const variants = [
      () => {
        writer.reasoning(
          "Summarizing from open receivables and recent invoice activity."
        );
        writer.text(
          "Bayview Supply's balance is due Thursday — I can draft a reminder or show their payment history."
        );
      },
      () => {
        writer
          .tool("get_customer", {
            dynamic: true,
            input: { customerId: "cust_northside" },
          })
          .sleep(350)
          .output({
            name: "Northside Distributors",
            openBalanceMinor: 7_500_000,
          });
        writer.text(
          "**Northside Distributors** has **$75,000** open across two invoices. Say if you want payment history or a collection draft."
        );
      },
      () => {
        writer.reasoning(
          "User asked about reorder quantities — I'll highlight zero on-hand SKUs first."
        );
        writer.text(
          "**CL-1180** is at zero on-hand at Main DC (reorder point 12). Want a restock suggestion or a purchase order draft?"
        );
      },
    ] as const;
    const writeFallback =
      variants[assistantTurns % variants.length] ?? variants[0];
    writeFallback();
  },
});
