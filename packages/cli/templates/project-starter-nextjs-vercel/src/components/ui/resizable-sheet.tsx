"use client";

import type React from "react";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// Context for shared state
interface ResizableSheetContextValue {
	width: number;
	setWidth: (width: number) => void;
	defaultWidth: number;
	minWidth: number;
	maxWidth: number;
}

const ResizableSheetContext = createContext<ResizableSheetContextValue | null>(null);

function useResizableSheet() {
	const context = useContext(ResizableSheetContext);
	if (!context) {
		throw new Error("ResizableSheet components must be used within a ResizableSheet");
	}
	return context;
}

// Root component that provides context
interface ResizableSheetProps extends React.ComponentProps<typeof Sheet> {
	defaultWidth?: number;
	minWidth?: number;
	maxWidth?: number;
}

function ResizableSheet({
	children,
	defaultWidth = 400,
	minWidth = 300,
	maxWidth = 800,
	...props
}: ResizableSheetProps) {
	const [width, setWidth] = useState(defaultWidth);

	const contextValue: ResizableSheetContextValue = {
		width,
		setWidth,
		defaultWidth,
		minWidth,
		maxWidth,
	};

	return (
		<ResizableSheetContext.Provider value={contextValue}>
			<Sheet {...props}>{children}</Sheet>
		</ResizableSheetContext.Provider>
	);
}

// Wrapper components that mirror the base sheet components
function ResizableSheetTrigger(props: React.ComponentProps<typeof SheetTrigger>) {
	return <SheetTrigger {...props} />;
}

function ResizableSheetHeader(props: React.ComponentProps<typeof SheetHeader>) {
	return <SheetHeader {...props} />;
}

function ResizableSheetTitle(props: React.ComponentProps<typeof SheetTitle>) {
	return <SheetTitle {...props} />;
}

function ResizableSheetDescription(props: React.ComponentProps<typeof SheetDescription>) {
	return <SheetDescription {...props} />;
}

// Content component with resize logic
interface ResizableSheetContentProps
	extends Omit<React.ComponentProps<typeof SheetContent>, "style"> {
	side?: "left" | "right";
	children?: React.ReactNode;
}

function ResizableSheetContent({
	side = "right",
	children,
	className,
	...props
}: ResizableSheetContentProps) {
	const { width, setWidth, minWidth, maxWidth } = useResizableSheet();
	const [isResizing, setIsResizing] = useState(false);
	const startXRef = useRef(0);
	const startWidthRef = useRef(0);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			setIsResizing(true);
			startXRef.current = e.clientX;
			startWidthRef.current = width;

			const handleMouseMove = (e: MouseEvent) => {
				const deltaX =
					side === "left"
						? e.clientX - startXRef.current // Add for left side
						: startXRef.current - e.clientX; // Subtract for right side
				const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + deltaX));
				setWidth(newWidth);
			};

			const handleMouseUp = () => {
				setIsResizing(false);
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};

			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		},
		[width, setWidth, side, minWidth, maxWidth],
	);

	const borderClass = side === "left" ? "border-r-0" : "border-l-0";

	return (
		<SheetContent
			side={side}
			className={cn("p-0", borderClass)}
			style={{ width: `${width}px`, maxWidth: "none" }}
			{...props}
		>
			<ResizableSheetResizeHandle
				side={side}
				onMouseDown={handleMouseDown}
				isResizing={isResizing}
			/>
			<div className={cn("p-4 h-full flex flex-col overflow-hidden", className)}>{children}</div>
		</SheetContent>
	);
}

// Resize handle component
interface ResizableSheetResizeHandleProps {
	side: "left" | "right";
	onMouseDown: (e: React.MouseEvent) => void;
	isResizing: boolean;
}

function ResizableSheetResizeHandle({
	side,
	onMouseDown,
	isResizing,
}: ResizableSheetResizeHandleProps) {
	const handlePosition = side === "left" ? "right-0" : "left-0";

	return (
		/** biome-ignore lint/a11y/noStaticElementInteractions: Ok */
		<div
			className={cn(
				"absolute top-0 bottom-0 w-1 bg-border hover:bg-primary/50 cursor-col-resize transition-colors",
				handlePosition,
				isResizing && "bg-primary",
			)}
			onMouseDown={onMouseDown}
		/>
	);
}

// Export all components
export {
	ResizableSheet,
	ResizableSheetTrigger,
	ResizableSheetContent,
	ResizableSheetHeader,
	ResizableSheetTitle,
	ResizableSheetDescription,
	ResizableSheetResizeHandle,
};
