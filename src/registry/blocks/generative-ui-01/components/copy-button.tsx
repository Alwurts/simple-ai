"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CopyButtonProps {
	value: string;
	className?: string;
}

export function CopyButton({ value, className }: CopyButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(value);
		setCopied(true);
		toast("Code copied to clipboard");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Button
			size="sm"
			variant="outline"
			onClick={handleCopy}
			className={className}
		>
			<div className="relative w-4 h-4 mr-2">
				<Copy
					className={`h-4 w-4 absolute inset-0 transition-all ${
						copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
					}`}
				/>
				<Check
					className={`h-4 w-4 absolute inset-0 text-green-500 transition-all ${
						copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
					}`}
				/>
			</div>
			Copy
		</Button>
	);
}
