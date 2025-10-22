"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { type ComponentProps, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ThemeToggle = ({
	className,
	...props
}: ComponentProps<typeof Button>) => {
	const { theme, setTheme } = useTheme();

	const toggleTheme = useCallback(() => {
		setTheme(theme === "light" ? "dark" : "light");
	}, [theme, setTheme]);

	return (
		<Button
			variant="ghost"
			size="icon-sm"
			className={cn("group/toggle", className)}
			onClick={toggleTheme}
			{...props}
		>
			<SunIcon className="hidden [html.dark_&]:block" />
			<MoonIcon className="hidden [html.light_&]:block" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
};
