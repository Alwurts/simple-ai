"use client";

import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { completeJsxTag, extractJsxContent } from "@/registry/lib/jsx-utils";
import { useState } from "react";

const SAMPLE_CODE = `function LandingPage() {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-600 h-screen w-screen flex flex-col items-center justify-center text-center px-4">
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
        <LucideIcon name="ArrowDown" className="text-white size-8 animate-bounce" />
      </div>
    </div>
  );
}`;

export default function PlaygroundPage() {
	const [sliderValue, setSliderValue] = useState([7]);

	const getPartialString = (str: string, percentage: number) => {
		const length = Math.floor((str.length * percentage) / 100);
		return str.slice(0, length);
	};

	const parseCode = (code: string) => {
		const extractedJsx = extractJsxContent(code);
		console.log("extracted", extractedJsx);
		if (!extractedJsx) {
			return "";
		}
		return completeJsxTag(extractedJsx);
	};

	return (
		<div className="flex-1 flex flex-col">
			<div className="p-4 flex-1">
				<Card className="w-full mx-auto flex flex-col gap-8 p-6">
					<div className="space-y-4">
						<div className="flex items-center gap-4">
							<h2 className="text-lg font-semibold">Code Visibility</h2>
							<span className="text-sm text-muted-foreground">
								{sliderValue}% shown
							</span>
						</div>
						<Slider
							value={sliderValue}
							onValueChange={setSliderValue}
							max={100}
							step={1}
							className="w-full"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						{/* <div className="space-y-4">
							<h2 className="text-lg font-semibold">Original Code</h2>
							<pre className="p-4 bg-muted rounded-lg overflow-x-auto h-[600px]">
								<code>{SAMPLE_CODE}</code>
							</pre>
						</div> */}

						<div className="space-y-4">
							<h2 className="text-lg font-semibold">Partial Code</h2>
							<pre className="p-4 bg-muted rounded-lg overflow-x-auto h-[600px]">
								<code>{getPartialString(SAMPLE_CODE, sliderValue[0])}</code>
							</pre>
						</div>

						<div className="space-y-4">
							<h2 className="text-lg font-semibold">Parsed Result</h2>
							<pre className="p-4 bg-muted rounded-lg overflow-x-auto h-[600px]">
								<code>
									{parseCode(getPartialString(SAMPLE_CODE, sliderValue[0]))}
								</code>
							</pre>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}
