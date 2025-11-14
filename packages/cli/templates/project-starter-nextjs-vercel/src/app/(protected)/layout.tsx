import { headers } from "next/headers";
import { redirect } from "next/navigation";
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

	return <>{children}</>;
}
