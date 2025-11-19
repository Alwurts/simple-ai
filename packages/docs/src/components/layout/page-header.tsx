import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function PageHeader({
	className,
	children,
	...props
}: React.ComponentProps<"section">) {
	return (
		<section className={cn("border-grid", className)} {...props}>
			<div className="container-wrapper">
				<div className="container flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
					{children}
				</div>
			</div>
		</section>
	);
}

function PageHeaderHeading({
	className,
	...props
}: React.ComponentProps<"h1">) {
	return (
		<h1
			className={cn(
				"text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]",
				className,
			)}
			{...props}
		/>
	);
}

function PageHeaderDescription({
	className,
	...props
}: React.ComponentProps<"p">) {
	return (
		<p
			className={cn(
				"text-muted-foreground max-w-2xl text-lg sm:text-xl font-light text-balance",
				className,
			)}
			{...props}
		/>
	);
}

function PageActions({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"flex w-full items-center justify-center gap-2 pt-2",
				className,
			)}
			{...props}
		/>
	);
}

// Themed button components for consistent header styling
function PageHeaderPrimaryButton({
	className,
	...props
}: React.ComponentProps<typeof Button>) {
	return (
		<Button
			size="sm"
			className={cn(
				"bg-brand rounded-full text-brand-foreground hover:bg-brand/90 border-none",
				className,
			)}
			{...props}
		/>
	);
}

function PageHeaderSecondaryButton({
	className,
	...props
}: React.ComponentProps<typeof Button>) {
	return (
		<Button
			size="sm"
			variant="ghost"
			className={cn("rounded-full", className)}
			{...props}
		/>
	);
}

export {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
	PageHeaderPrimaryButton,
	PageHeaderSecondaryButton,
};
