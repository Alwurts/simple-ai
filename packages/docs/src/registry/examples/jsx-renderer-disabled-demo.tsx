"use client";

import { Calendar, ChefHat, Clock } from "lucide-react";
import { JsxRenderer } from "@/registry/ui/jsx-renderer";

export default function JsxRendererDisabledDemo() {
	const jsx = `<div className="max-w-xl rounded-lg border bg-card p-6">
  <div className="flex items-center gap-2 mb-6">
    <ChefHat className="size-5 text-primary" />
    <h2 className="text-xl font-semibold">Restaurant Reservation</h2>
  </div>
  <div className="space-y-4 mb-6">
    <div className="flex items-center justify-between p-3 bg-muted rounded-md">
      <div className="flex items-center gap-2">
        <Calendar className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">Date</span>
      </div>
      <span className="text-sm">October 20, 2024</span>
    </div>
    <div className="flex items-center justify-between p-3 bg-muted rounded-md">
      <div className="flex items-center gap-2">
        <Clock className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">Time</span>
      </div>
      <span className="text-sm">7:00 PM</span>
    </div>
    <div className="flex items-center justify-between p-3 bg-muted rounded-md">
      <div>
        <div className="text-sm font-medium mb-1">The Golden Spoon</div>
        <div className="text-xs text-muted-foreground">Italian Cuisine • Downtown</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold">4 Guests</div>
        <div className="text-xs text-muted-foreground">Window Seat</div>
      </div>
    </div>
  </div>
  <div className="flex gap-2">
    <button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium">
      Confirm Reservation
    </button>
    <button className="flex-1 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md font-medium">
      Modify Details
    </button>
  </div>
</div>`;

	return (
		<div className="w-full">
			<JsxRenderer
				jsx={jsx}
				components={{ Calendar, Clock, ChefHat }}
				state="disabled"
				className="w-full"
			/>
		</div>
	);
}
