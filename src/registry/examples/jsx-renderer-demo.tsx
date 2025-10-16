"use client";

import { ArrowDown, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { JsxRenderer } from "@/registry/ui/jsx-renderer";

export default function JsxRendererDemo() {
	const fullJsx = `<div className="h-[500px] bg-gradient-to-br from-blue-600 to-purple-600 flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
        Welcome to Our Platform
      </h1>
      <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">
        We help businesses grow with innovative solutions and cutting-edge technology. Let's build something amazing together!
      </p>
      <div className="flex gap-4">
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
          Get Started
        </button>
        <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
          Learn More
        </button>
      </div>
      <div className="mt-12">
        <ArrowDown className="text-white size-8 animate-bounce" />
      </div>
    </div>`;

	const [percentage, setPercentage] = useState([100]);
	const [isExpanded, setIsExpanded] = useState(false);
	const partialJsx = fullJsx.slice(
		0,
		Math.floor((fullJsx.length * percentage[0]) / 100),
	);

	const displayCode = isExpanded
		? partialJsx
		: `${partialJsx.split("\n").slice(0, 3).join("\n")}\n  ...`;

	return (
		<div className="max-h-[550px] space-y-4 w-full overflow-y-auto py-4">
			<Slider
				value={percentage}
				onValueChange={setPercentage}
				max={100}
				step={1}
				className="w-full"
			/>

			<div className="border rounded-lg">
				<JsxRenderer
					jsx={partialJsx}
					components={{ ArrowDown }}
					className="w-full h-[500px]"
				/>
			</div>
			<div className="space-y-2">
				<div className="relative">
					<pre
						className={`p-4 bg-muted rounded-lg overflow-x-auto ${isExpanded ? "h-[400px]" : "h-[150px]"} overflow-y-auto`}
					>
						<code>{displayCode}</code>
					</pre>
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setIsExpanded(!isExpanded)}
					className="w-full flex items-center justify-center gap-2"
				>
					{isExpanded ? (
						<>
							Show less code <ChevronUp className="size-4" />
						</>
					) : (
						<>
							Show all code <ChevronDown className="size-4" />
						</>
					)}
				</Button>
			</div>
		</div>
	);
}
