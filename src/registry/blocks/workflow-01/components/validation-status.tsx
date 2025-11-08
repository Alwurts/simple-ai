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

	const badgeText =
		hasErrors && hasWarnings
			? `${validationState.errors.length} errors, ${validationState.warnings.length} warnings`
			: hasErrors
				? `${validationState.errors.length} errors`
				: `${validationState.warnings.length} warnings`;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<div className="cursor-pointer">
					<Badge
						variant={hasErrors ? "destructive" : "secondary"}
						className="gap-1"
					>
						{hasErrors ? (
							<AlertCircle className="size-3" />
						) : (
							<AlertTriangle className="size-3" />
						)}
						<span>{badgeText}</span>
					</Badge>
				</div>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="space-y-3">
					<div className="font-semibold text-sm">
						{hasErrors && hasWarnings
							? "Workflow Errors & Warnings"
							: hasErrors
								? "Workflow Errors"
								: "Workflow Warnings"}
					</div>

					{hasErrors && (
						<div className="space-y-2">
							<div className="text-xs font-medium text-red-900">
								Errors
							</div>
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
						</div>
					)}

					{hasWarnings && (
						<div className="space-y-2">
							<div className="text-xs font-medium text-yellow-900">
								Warnings
							</div>
							<div className="space-y-2 max-h-64 overflow-y-auto">
								{validationState.warnings.map(
									(warning, idx) => (
										<div
											key={`warning-${warning.type}-${warning.message}-${idx}`}
											className="text-xs p-2 bg-yellow-50 border border-yellow-200 rounded"
										>
											<div className="text-yellow-700">
												{warning.message}
											</div>
										</div>
									),
								)}
							</div>
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
