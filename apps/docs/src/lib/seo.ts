import { siteConfig } from "@/lib/config";

export function canonicalUrl(pathname: string) {
  if (pathname === "/") {
    return siteConfig.url;
  }
  return `${siteConfig.url}${pathname}`;
}

export function seo({
  title,
  description,
  pathname,
  noindex = false,
}: {
  title: string;
  description: string;
  pathname: string;
  noindex?: boolean;
}) {
  const url = canonicalUrl(pathname);
  return {
    links: [{ href: url, rel: "canonical" as const }],
    meta: [
      { title },
      { content: description, name: "description" },
      { content: url, property: "og:url" },
      { content: title, property: "og:title" },
      { content: description, property: "og:description" },
      { content: title, name: "twitter:title" },
      { content: description, name: "twitter:description" },
      ...(noindex ? [{ content: "noindex", name: "robots" }] : []),
    ],
  };
}
