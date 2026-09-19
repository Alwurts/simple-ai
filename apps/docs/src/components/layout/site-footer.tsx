import { siteConfig } from "@/lib/config";

const footerLinkClass = "font-medium underline underline-offset-4";

const destinations = [
  { href: "/blocks", label: "Examples" },
  { href: "/docs/components/chat-input", label: "Chat input" },
  { href: "/docs/installation", label: "Installation" },
] as const;

export function SiteFooter() {
  return (
    <footer>
      <div className="container-wrapper px-4 xl:px-6">
        <div className="flex min-h-(--footer-height) flex-col items-center justify-center gap-2 py-4 sm:flex-row sm:justify-between">
          <nav
            aria-label="Site"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-muted-foreground text-xs sm:text-sm"
          >
            {destinations.map((item) => (
              <a className={footerLinkClass} href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="px-1 text-center text-muted-foreground text-xs leading-loose sm:text-sm">
            Built by{" "}
            <a
              className={footerLinkClass}
              href={siteConfig.links.twitter}
              rel="noreferrer"
              target="_blank"
            >
              Alwurts
            </a>
            . Inspired by{" "}
            <a
              className={footerLinkClass}
              href="https://ui.shadcn.com"
              rel="noreferrer"
              target="_blank"
            >
              shadcn/ui
            </a>
            . The source code is available on{" "}
            <a
              className={footerLinkClass}
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
