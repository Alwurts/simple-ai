export const APEX_HOST = "simple-ai.dev";
export const PUBLIC_HOST = "www.simple-ai.dev";

export const siteConfig = {
  name: "simple-ai",
  url: `https://${PUBLIC_HOST}`,
  ogImage: `https://${PUBLIC_HOST}/og.jpg`,
  description: "Curated agent examples you can build upon",
  tagline: "Copy them into your app. Change the source.",
  links: {
    twitter: "https://x.com/alwurts",
    github: "https://github.com/Alwurts/simple-ai",
  },
  navItems: [
    { href: "/docs", label: "Documentation" },
    { href: "/docs/components/chat-input", label: "Components" },
    { href: "/blocks", label: "Blocks" },
  ],
};
