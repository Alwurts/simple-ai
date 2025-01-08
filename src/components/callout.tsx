import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ComponentProps } from "react";

export function Callout({
	title,
	children,
	icon,
	className,
	...props
}: ComponentProps<typeof Alert> & { icon?: string }) {
	return (
		<Alert className={cn("bg-muted/50", className)} {...props}>
			{icon && <span className="mr-4 text-2xl">{icon}</span>}
			{title && <AlertTitle>{title}</AlertTitle>}
			<AlertDescription>{children}</AlertDescription>
		</Alert>
	);
}
