import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="bg-background relative z-10 flex min-h-svh flex-col">
			<SiteHeader />
			<main className="flex flex-1 flex-col">{children}</main>
			<SiteFooter />
		</div>
	);
}
