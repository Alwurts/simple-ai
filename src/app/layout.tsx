import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import PlausibleProvider from "next-plausible";

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
				className={cn("antialiased", geistSans.variable, geistMono.variable)}
			>
				<PlausibleProvider domain="simple-ai.dev" customDomain="https://simple-ai.dev" selfHosted>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
						enableColorScheme
					>
						{children}
						<Toaster />
					</ThemeProvider>

					<GoogleAnalytics gaId="G-SJSDG0H2W0" />
				</PlausibleProvider>
			</body>
		</html>
	);
}
