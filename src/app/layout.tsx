import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import {
	Geist_Mono as FontMono,
	Geist as FontSans,
	Inter,
} from "next/font/google";
import "@/styles/globals.css";
import type { ReactNode } from "react";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

const fontMono = FontMono({
	subsets: ["latin"],
	variable: "--font-mono",
	weight: ["400"],
});

const fontInter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

export const metadata: Metadata = {
	title: siteConfig.name,
	metadataBase: new URL(siteConfig.url),
	description: siteConfig.description,
	keywords: [
		"AI SDK",
		"shadcn/ui",
		"simple-ai",
		"AI Chatbot",
		"React",
		"Next.js",
		"Tailwind CSS",
		"TypeScript",
	],
	authors: [
		{
			name: "Alwurts",
			url: "https://alwurts.com",
		},
	],
	creator: "Alwurts",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: siteConfig.url,
		title: siteConfig.name,
		description: siteConfig.description,
		siteName: siteConfig.name,
		images: [
			{
				url: siteConfig.ogImage,
				width: 1200,
				height: 630,
				alt: siteConfig.name,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description,
		images: [siteConfig.ogImage],
		creator: "@alwurts",
	},
};

interface RootLayoutProps {
	children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en">
			<body
				className={cn(
					"layout-fixed text-foreground group/body verscroll-none font-sans antialiased [--footer-height:calc(var(--spacing)*14)] [--header-height:calc(var(--spacing)*14)] xl:[--footer-height:calc(var(--spacing)*24)]",
					fontSans.variable,
					fontMono.variable,
					fontInter.variable,
				)}
			>
				<AnalyticsProvider>
					<ThemeProvider>
						{children}
						<Toaster />
					</ThemeProvider>
					<GoogleAnalytics gaId="G-SJSDG0H2W0" />
				</AnalyticsProvider>
			</body>
		</html>
	);
}
