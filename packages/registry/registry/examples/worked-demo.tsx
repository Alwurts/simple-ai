"use client";

import { Worked, WorkedContent, WorkedTrigger } from "@/components/ui/worked";

export default function WorkedPreview() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <Worked duration={4}>
        <WorkedTrigger />
        <WorkedContent>
          <p className="text-muted-foreground text-sm">List open invoices</p>
        </WorkedContent>
      </Worked>
      <p className="text-sm">
        Three customers have open balances due this week.
      </p>
    </div>
  );
}
