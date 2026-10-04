export const APEX_HOST = "simple-ai.dev";
export const PUBLIC_HOST = "www.simple-ai.dev";

export const siteConfig = {
  name: "simple-ai",
  url: `https://${PUBLIC_HOST}`,
  ogImage: `https://${PUBLIC_HOST}/og.jpg`,
  description: "Curated agent examples you can build upon",
  tagline:
    "Start a new app from the template, or add the block to the one you have. Then change the source.",
  links: {
    twitter: "https://x.com/alwurts",
    github: "https://github.com/Alwurts/simple-ai",
  },
  navItems: [
    { href: "/docs", label: "Docs" },
    { href: "/docs/components", label: "Components" },
    { href: "/blocks", label: "Blocks" },
    { href: "/templates", label: "Templates" },
  ],
};

export function isSiteNavActive(pathname: string, href: string) {
  if (href === "/docs") {
    return pathname === "/docs" || pathname === "/docs/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export const catalogNav = [
  {
    title: "Blocks",
    pages: [{ title: "Chat page", url: "/blocks" }],
  },
  {
    title: "Templates",
    pages: [{ title: "Starter", url: "/templates" }],
  },
];

export const mobileOutline = [
  {
    title: "Get Started",
    pages: [
      { title: "Introduction", url: "/docs" },
      { title: "Installation", url: "/docs/installation" },
    ],
  },
  {
    title: "Components",
    pages: [
      { title: "Chat input", url: "/docs/components/chat-input" },
      { title: "Tool", url: "/docs/components/tool" },
      { title: "Worked", url: "/docs/components/worked" },
    ],
  },
  ...catalogNav,
];
