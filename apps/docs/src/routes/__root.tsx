import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@/components/analytics";
import { SiteShell } from "@/components/layout/site-shell";
import { siteConfig } from "@/lib/config";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    links: [
      { href: appCss, rel: "stylesheet" },
      { href: "/favicon.ico", rel: "icon" },
      { href: "/favicon.svg", rel: "icon", type: "image/svg+xml" },
      { href: "https://fonts.googleapis.com", rel: "preconnect" },
      {
        href: "https://fonts.gstatic.com",
        rel: "preconnect",
        crossOrigin: "anonymous",
      },
      {
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap",
        rel: "stylesheet",
      },
    ],
    meta: [
      { charSet: "utf-8" },
      {
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
        name: "viewport",
      },
      { title: siteConfig.name },
      {
        content: siteConfig.description,
        name: "description",
      },
      { content: "#47B2E4", name: "theme-color" },
      { content: "website", property: "og:type" },
      { content: siteConfig.url, property: "og:url" },
      { content: siteConfig.name, property: "og:title" },
      { content: siteConfig.description, property: "og:description" },
      { content: siteConfig.name, property: "og:site_name" },
      { content: siteConfig.ogImage, property: "og:image" },
      { content: "summary_large_image", name: "twitter:card" },
      { content: siteConfig.name, name: "twitter:title" },
      { content: siteConfig.description, name: "twitter:description" },
      { content: siteConfig.ogImage, name: "twitter:image" },
      { content: "@alwurts", name: "twitter:creator" },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-SJSDG0H2W0"
        />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: gtag bootstrap
          dangerouslySetInnerHTML={{
            __html:
              "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-SJSDG0H2W0');",
          }}
        />
        <script
          data-domain="simple-ai.dev"
          defer
          src="https://plausible.alwurts.com/js/script.js"
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <Analytics />
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
