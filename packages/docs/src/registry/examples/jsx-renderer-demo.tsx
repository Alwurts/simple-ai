"use client";

import { Calendar, Clock, Plane } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { highlightCode } from "@/lib/highlight-code";
import { JsxRenderer } from "@/registry/ui/jsx-renderer";

const fullJsx = `<div className="max-w-xl rounded-lg border bg-card p-6">
  <div className="flex items-center gap-2 mb-6">
	<Plane className="size-5 text-primary" />
	<h2 className="text-xl font-semibold">Flight Reservation</h2>
  </div>
  <div className="space-y-4 mb-6">
	<div className="flex items-center justify-between p-3 bg-muted rounded-md">
	  <div className="flex items-center gap-2">
		<Calendar className="size-4 text-muted-foreground" />
		<span className="text-sm font-medium">Departure</span>
	  </div>
	  <span className="text-sm">June 15, 2024</span>
	</div>
	<div className="flex items-center justify-between p-3 bg-muted rounded-md">
	  <div className="flex items-center gap-2">
		<Clock className="size-4 text-muted-foreground" />
		<span className="text-sm font-medium">Time</span>
	  </div>
	  <span className="text-sm">10:30 AM</span>
	</div>
	<div className="flex items-center justify-between p-3 bg-muted rounded-md">
	  <div>
		<div className="text-sm font-medium mb-1">San Francisco (SFO)</div>
		<div className="text-xs text-muted-foreground">to New York (JFK)</div>
	  </div>
	  <div className="text-right">
		<div className="text-sm font-semibold">$349</div>
		<div className="text-xs text-muted-foreground">Economy</div>
	  </div>
	</div>
  </div>
  <div className="flex gap-2">
	<Button className="flex-1" onClick={() => onClickHandler("Select Flight")}>Select Flight</Button>
	<Button variant="outline" className="flex-1" onClick={() => onClickHandler("View Details")}>View Details</Button>
  </div>
</div>`;

export default function JsxRendererDemo() {
	const [percentage, setPercentage] = useState([100]);
	const [highlightedCode, setHighlightedCode] = useState<string>("");
	const partialJsx = fullJsx.slice(
		0,
		Math.floor((fullJsx.length * percentage[0]) / 100),
	);

	useEffect(() => {
		highlightCode(partialJsx, "tsx").then(setHighlightedCode);
	}, [partialJsx]);

	const onClickHandler = (value: string) => {
		toast.success(`${value} clicked`);
	};

	return (
		<div className="max-h-[450px] space-y-4 w-full overflow-y-auto py-4">
			<Slider
				value={percentage}
				onValueChange={setPercentage}
				max={100}
				step={1}
				className="w-full"
			/>

			<div className="border rounded-lg">
				<JsxRenderer
					blacklistedAttrs={[]}
					jsx={partialJsx}
					components={{ Plane, Calendar, Clock, Button }}
					className="w-full"
					bindings={{
						onClickHandler: onClickHandler,
					}}
				/>
			</div>
			<div className="space-y-2">
				<div className="relative">
					<div
						className="bg-code text-sm rounded-lg overflow-x-auto overflow-y-auto"
						dangerouslySetInnerHTML={{ __html: highlightedCode }}
					/>
				</div>
			</div>
		</div>
	);
}
