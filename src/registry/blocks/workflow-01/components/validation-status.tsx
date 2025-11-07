"use client";

import { AlertCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useWorkflow } from "@/registry/blocks/workflow-01/hooks/use-workflow";

export function ValidationStatus() {
	const validationState = useWorkflow((store) => store.validationState);

	const hasErrors = validationState.errors.length > 0;
	const hasWarnings = validationState.warnings.length > 0;

	if (!hasErrors && !hasWarnings) {
		return null;
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<div className="cursor-pointer">
					{hasErrors && (
						<Badge variant="destructive" className="gap-1">
							<AlertCircle className="size-3" />
							<span>{validationState.errors.length} errors</span>
						</Badge>
					)}
					{!hasErrors && hasWarnings && (
						<Badge variant="secondary" className="gap-1">
							<AlertTriangle className="size-3" />
							<span>
								{validationState.warnings.length} warnings
							</span>
						</Badge>
					)}
				</div>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="space-y-3">
					<div className="font-semibold text-sm">
						{hasErrors ? "Workflow Errors" : "Workflow Warnings"}
					</div>

					{hasErrors && (
						<div className="space-y-2 max-h-64 overflow-y-auto">
							{validationState.errors.map((error, idx) => (
								<div
									key={`error-${error.type}-${error.message}-${idx}`}
									className="text-xs p-2 bg-red-50 border border-red-200 rounded"
								>
									<div className="font-medium text-red-900">
										{error.type}
									</div>
									<div className="text-red-700 mt-1">
										{error.message}
									</div>
								</div>
							))}
						</div>
					)}

					{!hasErrors && hasWarnings && (
						<div className="space-y-2 max-h-64 overflow-y-auto">
							{validationState.warnings.map((warning, idx) => (
								<div
									key={`warning-${warning}-${
										// biome-ignore lint/suspicious/noArrayIndexKey: Neede it
										idx
									}`}
									className="text-xs p-2 bg-yellow-50 border border-yellow-200 rounded"
								>
									<div className="text-yellow-700">
										{warning}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
