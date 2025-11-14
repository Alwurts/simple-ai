import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Toolbar() {
	return (
		<div className="bg-background text-foreground border-b border-border">
			<div className="max-w-7xl mx-auto px-3 py-2 flex items-center justify-between gap-2">
				<div className="flex-1 text-center flex flex-col items-center justify-center">
					<h4 className="font-bold text-xl">Generate X Bio with AI</h4>
					<p className="text-muted-foreground text-sm">
						See how your profile will look
					</p>
				</div>
				<ThemeToggle />
			</div>
		</div>
	);
}
