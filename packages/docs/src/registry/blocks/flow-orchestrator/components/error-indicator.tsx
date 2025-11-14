import { AlertCircle } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { WorkflowError } from "@/registry/lib/flow/workflow";

interface ErrorIndicatorProps {
	errors: WorkflowError[];
}

export function ErrorIndicator({
	errors,
}: ErrorIndicatorProps): React.ReactElement | null {
	if (errors.length === 0) {
		return null;
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" className="text-red-500">
					<AlertCircle className="h-5 w-5" />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="center" className="w-80 mt-4 mr-4">
				<div className="space-y-2">
					<h4 className="font-medium">Workflow Errors</h4>
					<div className="space-y-1">
						{errors.map((error) => (
							<div
								key={`${error.type}-${error.message}`}
								className="text-sm text-red-500"
							>
								{error.message}
							</div>
						))}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
