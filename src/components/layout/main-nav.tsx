"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { docsConfig } from "@/config/docs";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { LogoIcon } from "../icons/logo-icon";

export function MainNav() {
	const pathname = usePathname();

	return (
		<div className="mr-4 hidden md:flex">
			<Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
				<LogoIcon className="size-8" />
				<span className="hidden font-bold lg:inline-block">
					{siteConfig.name}
				</span>
			</Link>
			<nav className="flex items-center gap-4 text-sm xl:gap-6">
				{docsConfig.mainNav.slice(1).map((navItem) => (
					<Link
						key={navItem.href}
						href={navItem.href ?? ""}
						className={cn(
							"transition-colors hover:text-foreground/80",
							pathname === navItem.href
								? "text-foreground"
								: "text-foreground/80",
						)}
					>
						{navItem.title}
					</Link>
				))}
			</nav>
		</div>
	);
}
