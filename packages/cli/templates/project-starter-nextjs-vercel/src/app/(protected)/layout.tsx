import { headers } from "next/headers";
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

	if (!session) {
		redirect("/login");
	}

	return <AppLayout>{children}</AppLayout>;
}
