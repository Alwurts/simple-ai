import { createFileRoute } from "@tanstack/react-router";
import { siteConfig } from "@/lib/config";
import { source } from "@/lib/source";

const STATIC_PATHS = ["/", "/blocks", "/view/chat-page"];

function loc(path: string) {
  if (path === "/") {
    return siteConfig.url;
  }
  return `${siteConfig.url}${path}`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET() {
        const docs = source.getPages().map((page) => page.url);
        const urls = [...STATIC_PATHS, ...docs];
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url>
    <loc>${loc(path)}</loc>
  </url>`
  )
  .join("\n")}
</urlset>
`;
        return new Response(body, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
          },
        });
      },
    },
  },
});
