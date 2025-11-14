import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

interface ThemeProviderLayoutProps {
	children: ReactNode;
}

export default function ThemeProviderLayout({
	children,
}: ThemeProviderLayoutProps) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
			enableColorScheme
		>
			{children}
		</ThemeProvider>
	);
}
