import { cva } from "class-variance-authority";
import type { ComponentProps } from "react";
import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import JsxParser from "react-jsx-parser";
import { cn } from "@/lib/utils";
import { completeJsxTag } from "@/registry/lib/jsx-utils";

const jsxRendererVariants = cva("", {
	variants: {
		state: {
			disabled: "opacity-50 cursor-not-allowed pointer-events-none",
			"read-only": "pointer-events-none",
			streaming:
				"opacity-65 cursor-not-allowed pointer-events-none animate-pulse",
			interactive: "",
			error: "border-2 border-destructive",
		},
	},
	defaultVariants: {
		state: "interactive",
	},
});

type JsxRendererProps = ComponentProps<typeof JsxParser> & {
	fixIncompleteJsx?: boolean;
	jsx: string;
	state?: "disabled" | "read-only" | "interactive" | "streaming" | "error";
	fallback?: React.ComponentType;
	onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
};

function JsxRendererInner({
	className,
	jsx,
	fixIncompleteJsx = true,
	state,
	...props
}: Omit<JsxRendererProps, "fallback" | "onError">) {
	const processedJsx = React.useMemo(() => {
		return fixIncompleteJsx ? completeJsxTag(jsx) : jsx;
	}, [jsx, fixIncompleteJsx]);

	return (
		<JsxParser
			className={cn(jsxRendererVariants({ state }), className)}
			jsx={processedJsx}
			{...props}
		/>
	);
}

export function ErrorFallback() {
	return (
		<div className="flex items-center justify-center h-32 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm font-medium">
			Error rendering
		</div>
	);
}

interface JsxRendererErrorBoundaryProps {
	children: React.ReactNode;
	fallback?: React.ComponentType;
	onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

function JsxRendererErrorBoundary({
	children,
	fallback = ErrorFallback,
	onError,
}: JsxRendererErrorBoundaryProps) {
	const Fallback = fallback;
	return (
		<ErrorBoundary fallback={<Fallback />} onError={onError}>
			{children}
		</ErrorBoundary>
	);
}

export const JsxRenderer = React.memo(function JsxRenderer(
	props: JsxRendererProps,
) {
	const { fallback, onError, ...innerProps } = props;
	return (
		<JsxRendererErrorBoundary fallback={fallback} onError={onError}>
			<JsxRendererInner {...innerProps} />
		</JsxRendererErrorBoundary>
	);
});
