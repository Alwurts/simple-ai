"use client";

import { PanelRight, PanelRightClose } from "lucide-react";
import { createContext, Fragment, useCallback, useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { AppSidebar } from "./app-sidebar";

// --- 1. Global Shell (Layout Wrapper) ---

export function AppLayout({
	children,
	defaultOpen = true,
}: {
	children: React.ReactNode;
	defaultOpen?: boolean;
}) {
	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<AppSidebar />
			<div className="h-svh relative flex w-full flex-1 flex-col md:peer-data-[variant=inset]:p-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:pl-0 md:peer-data-[variant=inset]:pl-0">
				<SidebarInset className="overflow-hidden rounded-xl shadow bg-background">
					{children}
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}

// --- 2. Page Container ---

export function AppLayoutPage({ className, children, ...props }: React.ComponentProps<"div">) {
	return (
		<div className={cn("flex flex-col h-full w-full overflow-hidden", className)} {...props}>
			{children}
		</div>
	);
}

// --- 3. Header System ---

export function AppLayoutHeader({ className, children, ...props }: React.ComponentProps<"header">) {
	return (
		<header
			className={cn(
				"flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
				className,
			)}
			{...props}
		>
			<SidebarTrigger className="-ml-1 md:hidden" />
			<Separator orientation="vertical" className="mr-2 h-4 md:hidden" />
			{children}
		</header>
	);
}

export function AppLayoutHeaderIcon({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"flex items-center justify-center text-muted-foreground [&>svg]:size-4",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export function AppLayoutHeaderTitle({
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

export function AppLayoutHeaderActions({
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

/**
 *
 * @param className - The class name to apply to the content area.
 * @param children - The children to render inside the content area.
 * @param variant - The variant of the content area, Use "fixed" so child components (Table/Doc) control their own scroll.
 * @param props - The props to apply to the content area.
 * @returns
 */
export function AppLayoutContent({ className, children, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("flex-1 min-h-0 w-full overflow-hidden flex flex-col", className)}
			{...props}
		>
			{children}
		</div>
	);
}

// --- 5. Resizable Layout System ---

// --- Resizable Context ---

type ResizableContextValue = {
	panels: Record<string, boolean>;
	togglePanel: (panelId: string) => void;
	setPanelOpen: (panelId: string, open: boolean) => void;
};

const ResizableContext = createContext<ResizableContextValue | null>(null);

export function useResizablePanels() {
	const context = useContext(ResizableContext);
	if (!context) {
		throw new Error("useResizablePanels must be used within AppLayoutResizableProvider");
	}
	return context;
}

export function AppLayoutResizable({
	className,
	direction = "horizontal",
	children,
	...props
}: Omit<React.ComponentProps<typeof ResizablePanelGroup>, "direction"> & {
	direction?: "horizontal" | "vertical";
	children: React.ReactNode;
}) {
	const [panels, setPanels] = useState<Record<string, boolean>>({});

	const togglePanel = useCallback((panelId: string) => {
		setPanels((prev) => ({ ...prev, [panelId]: !prev[panelId] }));
	}, []);

	const setPanelOpen = useCallback((panelId: string, open: boolean) => {
		setPanels((prev) => ({ ...prev, [panelId]: open }));
	}, []);

	const contextValue = {
		panels,
		togglePanel,
		setPanelOpen,
	};

	return (
		<ResizableContext.Provider value={contextValue}>
			<ResizablePanelGroup
				direction={direction}
				className={cn("flex-1 min-h-0", className)}
				{...props}
			>
				{children}
			</ResizablePanelGroup>
		</ResizableContext.Provider>
	);
}

export function AppLayoutResizablePanelPrimary({
	className,
	children,
	...props
}: React.ComponentProps<typeof ResizablePanel>) {
	return (
		<ResizablePanel
			className={cn("flex flex-col min-h-0 flex-1 w-full overflow-hidden", className)}
			{...props}
		>
			{children}
		</ResizablePanel>
	);
}

export function AppLayoutResizablePanelSecondary({
	className,
	children,
	id,
	defaultOpen = true,
	...props
}: React.ComponentProps<typeof ResizablePanel> & {
	defaultOpen?: boolean;
}) {
	const { panels, setPanelOpen } = useResizablePanels();

	// Initialize panel state if not set
	useEffect(() => {
		if (id && panels[id] === undefined) {
			setPanelOpen(id, defaultOpen);
		}
	}, [id, defaultOpen, panels, setPanelOpen]);

	// Don't render if panel is closed
	if (id && panels[id] === false) {
		return null;
	}

	return (
		<Fragment>
			<ResizableHandle className="bg-transparent" />
			<ResizablePanel
				className={cn(
					"flex flex-col min-h-0 border-l border-border bg-accent/5 overflow-hidden rounded-l-xl shadow ml-px",
					className,
				)}
				{...props}
			>
				{children}
			</ResizablePanel>
		</Fragment>
	);
}

export function AppLayoutResizablePanelTrigger({
	className,
	children,
	panelId,
	...props
}: React.ComponentProps<typeof Button> & {
	panelId: string;
}) {
	const { panels, togglePanel } = useResizablePanels();

	return (
		<Button
			variant="ghost"
			size="icon"
			className={className}
			onClick={() => togglePanel(panelId)}
			aria-label={panels[panelId] !== false ? "Close panel" : "Open panel"}
			{...props}
		>
			{panels[panelId] !== false ? <PanelRightClose /> : <PanelRight />}
			{children}
		</Button>
	);
}
