"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const examples = [
	{
		name: "Chat",
		href: "/examples/dashboard",
		code: "https://github.com/shadcn/ui/tree/main/apps/v4/app/(app)/examples/dashboard",
		hidden: false,
	},
	{
		name: "Workflow",
		href: "/examples/workflow",
		code: "https://github.com/shadcn/ui/tree/main/apps/v4/app/(app)/examples/tasks",
		hidden: false,
	},
];

export function ExamplesNav({
	className,
	...props
}: React.ComponentProps<"div">) {
	const pathname = usePathname();

	return (
		<div className={cn("flex items-center", className)} {...props}>
			<ScrollArea className="max-w-[96%] md:max-w-[600px] lg:max-w-none">
				<div className="flex items-center">
					<ExampleLink
						example={{
							name: "Examples",
							href: "/",
							code: "",
							hidden: false,
						}}
						isActive={pathname === "/"}
					/>
					{examples.map((example) => (
						<ExampleLink
							key={example.href}
							example={example}
							isActive={
								pathname?.startsWith(example.href) ?? false
							}
						/>
					))}
				</div>
				<ScrollBar orientation="horizontal" className="invisible" />
			</ScrollArea>
		</div>
	);
}

function ExampleLink({
	example,
	isActive,
}: {
	example: (typeof examples)[number];
	isActive: boolean;
}) {
	if (example.hidden) {
		return null;
	}

	return (
		<Link
			href={example.href}
			key={example.href}
			className="text-muted-foreground hover:text-primary data-[active=true]:text-primary flex h-7 items-center justify-center px-4 text-center text-base font-medium transition-colors"
			data-active={isActive}
		>
			{example.name}
		</Link>
	);
}
