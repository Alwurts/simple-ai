import Link from "next/link";
import { CommandMenu } from "@/components/general/command-menu";
import { GithubIcon } from "@/components/icons/github-icon";
import { LogoIcon } from "@/components/icons/logo-icon";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/config";
import { source } from "@/lib/source";

export function SiteHeader() {
	const pageTree = source.pageTree;

	return (
		<header className="sticky top-(--header-offset) z-50 w-full px-4 md:px-6">
			<div className="mx-auto max-w-6xl rounded-2xl border bg-background/80 shadow-sm backdrop-blur-md">
				<div className="flex h-(--header-height) items-center px-4 gap-2">
					<MobileNav
						tree={pageTree}
						items={siteConfig.navItems}
						className="flex lg:hidden"
					/>
					<Button
						asChild
						variant="ghost"
						size="sm"
						className="flex gap-2 hover:bg-transparent"
					>
						<Link href="/">
							{/* Use text-brand here to inject color */}
							<LogoIcon className="size-6" />
							<span className="font-bold text-base tracking-tight">
								{siteConfig.name}
							</span>
						</Link>
					</Button>

					{/* Centered Navigation for balance */}
					<div className="hidden lg:flex flex-1 justify-center">
						<MainNav items={siteConfig.navItems} />
					</div>

					<div className="ml-auto flex items-center gap-2">
						<div className="hidden md:flex">
							<CommandMenu
								tree={pageTree}
								navItems={siteConfig.navItems}
							/>
						</div>
						<Separator
							orientation="vertical"
							className="ml-2 hidden h-4 lg:block"
						/>
						<Button
							asChild
							size="icon-sm"
							variant="ghost"
							className="h-8 w-8 rounded-full"
						>
							<Link
								href={siteConfig.links.github}
								target="_blank"
								rel="noreferrer"
							>
								<GithubIcon className="size-4" />
							</Link>
						</Button>
						<ThemeToggle className="rounded-full" />
					</div>
				</div>
			</div>
		</header>
	);
}
