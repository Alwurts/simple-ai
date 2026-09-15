"use client";

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ui/reasoning";

export default function ReasoningPreview() {
  return (
    <div className="w-full max-w-md">
      <Reasoning defaultOpen>
        <ReasoningTrigger />
        <ReasoningContent>
          The user asked about open invoices due this week. I will filter
          finalized invoices with a remaining balance and summarize by customer.
        </ReasoningContent>
      </Reasoning>
    </div>
  );
}
