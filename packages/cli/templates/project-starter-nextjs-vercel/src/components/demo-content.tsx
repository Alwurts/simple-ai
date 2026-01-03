export function DemoContent() {
	return (
		<div className="space-y-6 h-full p-4">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<div className="p-6 bg-card rounded-lg border">
					<h3 className="font-semibold mb-2">Main Content</h3>
					<p className="text-sm text-muted-foreground">This is the primary content area.</p>
				</div>

				<div className="p-6 bg-card rounded-lg border">
					<h3 className="font-semibold mb-2">Demo Section</h3>
					<p className="text-sm text-muted-foreground">
						This demonstrates the layout capabilities.
					</p>
				</div>

				<div className="p-6 bg-card rounded-lg border">
					<h3 className="font-semibold mb-2">Additional Content</h3>
					<p className="text-sm text-muted-foreground">
						You can add more components and content here.
					</p>
				</div>
			</div>
		</div>
	);
}
