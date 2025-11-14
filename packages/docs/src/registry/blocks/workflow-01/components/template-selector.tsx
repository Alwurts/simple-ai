import { LayoutTemplate } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { WORKFLOW_TEMPLATES } from "@/registry/blocks/workflow-01/lib/templates";

interface TemplateSelectorProps {
	selectedTemplateId: string;
	onTemplateSelect: (templateId: string) => void;
	className?: string;
}

export function TemplateSelector({
	selectedTemplateId,
	onTemplateSelect,
	className,
}: TemplateSelectorProps) {
	const selectedTemplate = WORKFLOW_TEMPLATES.find(
		template => template.id === selectedTemplateId,
	);

	const categories = [...new Set(WORKFLOW_TEMPLATES.map(t => t.category))];

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<span className="text-muted-foreground text-sm">Template:</span>
			<Select value={selectedTemplateId} onValueChange={onTemplateSelect}>
				<SelectTrigger className="w-[240px] h-9">
					<div className="flex items-center gap-2">
						<LayoutTemplate className="h-4 w-4 shrink-0" />
						<SelectValue>
							<span className="font-medium text-sm">
								{selectedTemplate?.name || "Select Template"}
							</span>
						</SelectValue>
					</div>
				</SelectTrigger>
				<SelectContent>
					{categories.map(category => (
						<div key={category}>
							<div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
								{category}
							</div>
							{WORKFLOW_TEMPLATES.filter(t => t.category === category).map(
								template => (
									<SelectItem key={template.id} value={template.id}>
										<div className="flex flex-col items-start">
											<span className="font-medium">{template.name}</span>
											<span className="text-xs text-muted-foreground">
												{template.description}
											</span>
										</div>
									</SelectItem>
								),
							)}
							{category !== categories[categories.length - 1] && (
								<div className="border-b my-1" />
							)}
						</div>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
