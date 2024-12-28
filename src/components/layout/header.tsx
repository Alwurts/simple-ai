import Link from "next/link";

import { siteConfig } from "@/config/site";

import { GithubIcon } from "../icons/github-icon";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme/theme-toggle";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { CommandMenu } from "../command-menu";

export function SiteHeader() {
	return (
		<header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container-wrapper">
				<div className="container flex h-14 items-center">
					<MainNav />
					<MobileNav />
					<div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
						<div className="w-full flex-1 md:w-auto md:flex-none">
							<CommandMenu />
						</div>
						<nav className="flex items-center gap-0.5">
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 px-0"
								asChild
							>
								<Link
									href={siteConfig.links.github}
									target="_blank"
									rel="noreferrer"
								>
									<GithubIcon className="h-4 w-4" />
									<span className="sr-only">GitHub</span>
								</Link>
							</Button>
							<ThemeToggle />
						</nav>
					</div>
				</div>
			</div>
		</header>
	);
}
