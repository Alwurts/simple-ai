import { siteConfig } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer>
      <div className="container-wrapper px-4 xl:px-6">
        <div className="flex h-(--footer-height) items-center justify-between">
          <div className="w-full px-1 text-center text-muted-foreground text-xs leading-loose sm:text-sm">
            Built by{" "}
            <a
              className="font-medium underline underline-offset-4"
              href={siteConfig.links.twitter}
              rel="noreferrer"
              target="_blank"
            >
              Alwurts
            </a>
            . Inspired by{" "}
            <a
              className="font-medium underline underline-offset-4"
              href="https://ui.shadcn.com"
              rel="noreferrer"
              target="_blank"
            >
              shadcn/ui
            </a>
            . The source code is available on{" "}
            <a
              className="font-medium underline underline-offset-4"
              href={siteConfig.links.github}
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </a>
            .
          </div>
        </div>
      </div>
    </footer>
  );
}
