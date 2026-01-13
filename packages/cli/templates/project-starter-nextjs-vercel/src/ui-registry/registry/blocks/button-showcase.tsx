import { Button } from "@/components/ui/button";

export default function ButtonShowcase() {
	return (
		<div className="space-y-8 p-8">
			<div className="space-y-4">
				<h2 className="text-2xl font-bold">Button Variants</h2>
				<div className="flex flex-wrap gap-2">
					<Button variant="default">Default</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="destructive">Destructive</Button>
					<Button variant="link">Link</Button>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="text-2xl font-bold">Button Sizes</h2>
				<div className="flex flex-wrap items-center gap-2">
					<Button size="sm">Small</Button>
					<Button size="default">Default</Button>
					<Button size="lg">Large</Button>
					<Button size="icon" variant="outline">
						⚙️
					</Button>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="text-2xl font-bold">Button States</h2>
				<div className="flex flex-wrap gap-2">
					<Button>Enabled</Button>
					<Button disabled>Disabled</Button>
					<Button variant="outline">Outline</Button>
				</div>
			</div>
		</div>
	);
}
