"use client";

import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ui/tool";

export default function ToolPreview() {
  return (
    <div className="w-full max-w-md">
      <Tool>
        <ToolHeader
          state="output-available"
          title="list open invoices"
          type="tool-list_open_invoices"
        />
        <ToolContent>
          <ToolInput input={{ dueWithinDays: 7, status: "finalized" }} />
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
