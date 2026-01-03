import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { auth } from "@/lib/auth";

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

	return <AppLayout defaultOpen={defaultOpen}>{children}</AppLayout>;
}
