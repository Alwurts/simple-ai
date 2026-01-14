import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { auth } from "@/lib/auth";
import { AppLayout } from "@/ui-registry/registry/ui/app-layout";

export default async function ProtectedLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const headersList = await headers();
	const session = await auth.api.getSession({
		headers: headersList,
	});

	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

	if (!session) {
		redirect("/login");
	}

	return (
		<AppLayout defaultOpen={defaultOpen} sidebar={<AppSidebar />}>
			{children}
		</AppLayout>
	);
}
