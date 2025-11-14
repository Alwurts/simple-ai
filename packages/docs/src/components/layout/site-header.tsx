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
import { XIcon } from "../icons/x-icon";

export function SiteHeader() {
	const pageTree = source.pageTree;

	return (
		<header className="bg-background sticky top-0 z-50 w-full">
			<div className="container-wrapper 3xl:fixed:px-0 px-6">
				<div className="3xl:fixed:container flex h-(--header-height) items-center gap-2 **:data-[slot=separator]:!h-4">
					<MobileNav
						tree={pageTree}
						items={siteConfig.navItems}
						className="flex lg:hidden"
					/>
					<Button
						asChild
						variant="ghost"
						size="sm"
						className="hidden lg:flex gap-2"
					>
						<Link href="/">
							<LogoIcon className="size-7" />
							<span className="font-bold text-base">{siteConfig.name}</span>
						</Link>
					</Button>
					<MainNav items={siteConfig.navItems} className="hidden lg:flex" />
					<div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
						<div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
							<CommandMenu tree={pageTree} navItems={siteConfig.navItems} />
						</div>
						<Separator
							orientation="vertical"
							className="ml-2 hidden lg:block"
						/>
						<Button
							asChild
							size="icon-sm"
							variant="ghost"
							className="h-8 shadow-none"
						>
							<Link
								href={siteConfig.links.github}
								target="_blank"
								rel="noreferrer"
							>
								<GithubIcon className="size-4" />
							</Link>
						</Button>
						<Button
							asChild
							size="icon-sm"
							variant="ghost"
							className="h-8 shadow-none"
						>
							<Link
								href={siteConfig.links.twitter}
								target="_blank"
								rel="noreferrer"
							>
								<XIcon className="size-4" />
							</Link>
						</Button>
						<ThemeToggle />
					</div>
				</div>
			</div>
		</header>
	);
}
