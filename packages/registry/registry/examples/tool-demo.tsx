"use client";

import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ui/tool";

const input = { dueWithinDays: 7, status: "finalized" };

export default function ToolPreview() {
  return (
    <div className="w-full max-w-md">
      <Tool>
        <ToolHeader
          input={input}
          state="output-available"
          title="list_open_invoices"
          type="tool-list_open_invoices"
        />
        <ToolContent>
          <ToolInput input={input} />
          <ToolOutput
            errorText={undefined}
            output={{
              count: 3,
              invoices: [
                { id: "INV-1042", customer: "Northside Distributors" },
              ],
            }}
          />
        </ToolContent>
      </Tool>
    </div>
  );
}
