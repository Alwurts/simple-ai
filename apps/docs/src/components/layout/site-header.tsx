import { Button } from "@workspace/ui/components/shadcn/button";
import { Separator } from "@workspace/ui/components/shadcn/separator";
import { CommandMenu } from "@/components/general/command-menu";
import { GithubIcon } from "@/components/icons/github-icon";
import { LogoIcon } from "@/components/icons/logo-icon";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { siteConfig } from "@/lib/config";

export function SiteHeader() {
  return (
    <header className="sticky top-(--header-offset) z-50 w-full px-4 md:px-6">
      <div className="mx-auto max-w-6xl rounded-2xl border bg-background/80 shadow-sm backdrop-blur-md">
        <div className="flex h-(--header-height) items-center gap-2 px-4">
          <MobileNav className="flex lg:hidden" />
          <Button
            className="flex gap-2 hover:bg-transparent"
            render={<a href="/" />}
            size="sm"
            variant="ghost"
          >
            <LogoIcon className="size-6" />
            <span className="font-bold text-base tracking-tight">
              {siteConfig.name}
            </span>
          </Button>

          <div className="hidden flex-1 justify-center lg:flex">
            <MainNav />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:flex">
              <CommandMenu />
            </div>
            <Separator
              className="ml-2 hidden h-4 w-px self-center data-vertical:h-4 data-vertical:self-center lg:block"
              orientation="vertical"
            />
            <Button
              className="size-8 rounded-full"
              render={
                <a
                  href={siteConfig.links.github}
                  rel="noreferrer"
                  target="_blank"
                />
              }
              size="icon-sm"
              variant="ghost"
            >
              <GithubIcon className="size-4" />
              <span className="sr-only">GitHub</span>
            </Button>
            <ThemeToggle className="rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
}
