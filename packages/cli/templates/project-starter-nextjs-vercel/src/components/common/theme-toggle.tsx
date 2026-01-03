"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export const ThemeToggle = ({ variant = "default" }: { variant?: "default" | "icon" }) => {
	const { theme, setTheme } = useTheme();

	const toggleTheme = useCallback(() => {
		setTheme(theme === "light" ? "dark" : "light");
	}, [theme, setTheme]);

	if (variant === "icon") {
		return (
			<Button variant="ghost" size="icon" onClick={toggleTheme}>
				<SunIcon className="hidden [html.dark_&]:block" />
				<MoonIcon className="hidden [html.light_&]:block" />
				<span className="sr-only">Toggle theme</span>
			</Button>
		);
	}

	return (
		<SidebarMenuButton tooltip="Toggle theme" size="sm" onClick={toggleTheme}>
			<SunIcon className="hidden [html.dark_&]:block" />
			<MoonIcon className="hidden [html.light_&]:block" />
			<span>Toggle theme</span>
		</SidebarMenuButton>
	);
};
