import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: siteConfig.name,
	metadataBase: new URL(siteConfig.url),
	description: siteConfig.description,
	keywords: [
		"AI SDK",
		"shadcn/ui",
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
				className={cn("antialiased", geistSans.variable, geistMono.variable)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
					enableColorScheme
				>
					<div className="min-h-screen bg-background flex flex-col">
						{children}
					</div>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
