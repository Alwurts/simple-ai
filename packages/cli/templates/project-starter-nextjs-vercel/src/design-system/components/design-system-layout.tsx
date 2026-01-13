import { cn } from "@/lib/utils";
import { getAllRegistryItems } from "@/ui-registry/lib/registry";
import { DesignSystemLayoutClient } from "./design-system-layout-client";

// --- 1. Global Shell (Layout Wrapper) ---

export async function DesignSystemLayout({
	children,
	defaultOpen = true,
}: {
	children: React.ReactNode;
	defaultOpen?: boolean;
}) {
	const [components, blocks] = await Promise.all([
		getAllRegistryItems(["registry:ui"]),
		getAllRegistryItems(["registry:block"]),
	]);

	return (
		<DesignSystemLayoutClient
			defaultOpen={defaultOpen}
			components={components.map((item) => ({
				name: item.name,
				title: item.title,
				description: item.description,
			}))}
			blocks={blocks.map((item) => ({
				name: item.name,
				title: item.title,
				description: item.description,
			}))}
		>
			{children}
		</DesignSystemLayoutClient>
	);
}

// --- 2. Page Container ---

export function DesignSystemLayoutPage({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div className={cn("flex flex-col h-full w-full overflow-hidden", className)} {...props}>
			{children}
		</div>
	);
}

// --- 3. Header System ---

export function DesignSystemLayoutHeader({
	className,
	children,
	...props
}: React.ComponentProps<"header">) {
	return (
		<header
			className={cn(
				"flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
				className,
			)}
			{...props}
		>
			{children}
		</header>
	);
}

export function DesignSystemLayoutHeaderTitle({
	className,
	children,
	...props
}: React.ComponentProps<"h1">) {
	return (
		<h1 className={cn("text-sm font-medium text-foreground truncate", className)} {...props}>
			{children}
		</h1>
	);
}

export function DesignSystemLayoutHeaderActions({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div className={cn("ml-auto flex items-center gap-2", className)} {...props}>
			{children}
		</div>
	);
}

// --- 4. Content Area ---

export function DesignSystemLayoutContent({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div className={cn("flex-1 min-h-0 w-full overflow-auto flex flex-col", className)} {...props}>
			{children}
		</div>
	);
}
