import { cn } from "@/lib/utils";

export function PageNav({
	children,
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("container-wrapper scroll-mt-24", className)}
			{...props}
		>
			<div className="container flex items-center justify-between gap-4 py-6">
				{children}
			</div>
		</div>
	);
}

export function PageNavTitle({
	className,
	...props
}: React.ComponentProps<"h2">) {
	return (
		<h2
			className={cn(
				"text-2xl font-semibold tracking-tight md:text-3xl",
				className,
			)}
			{...props}
		/>
	);
}
