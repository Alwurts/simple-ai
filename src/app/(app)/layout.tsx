import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/site-footer";
import type { ReactNode } from "react";

interface AppLayoutProps {
	children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
	return (
		<div className="min-h-screen bg-background flex flex-col">
			<div data-wrapper="" className="flex flex-1 flex-col">
				<SiteHeader />
				<main className="flex flex-1 flex-col">{children}</main>
				<SiteFooter />
			</div>
		</div>
	);
}
