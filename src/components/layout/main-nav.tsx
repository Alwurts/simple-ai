"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
				<Link
					href="/docs"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathname === "/docs" ? "text-foreground" : "text-foreground/80",
					)}
				>
					Docs
				</Link>
				<Link
					href="/docs/components"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathname?.startsWith("/docs/components") &&
							!pathname?.startsWith("/docs/component/chart")
							? "text-foreground"
							: "text-foreground/80",
					)}
				>
					Components
				</Link>
				<Link
					href="/blocks"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathname?.startsWith("/blocks")
							? "text-foreground"
							: "text-foreground/80",
					)}
				>
					Blocks
				</Link>
			</nav>
		</div>
	);
}
