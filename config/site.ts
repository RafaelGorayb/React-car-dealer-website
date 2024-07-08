export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Estoque",
      href: "/estoque",
    },
    {
      label: "Contato",
      href: "/contato",
    },
    {
      label: "Localização",
      href: "/localizacao",
    },
    {
      label: "Baixar App",
      href: "/baixar-app",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Estoque",
      href: "/estoque",
    },
    {
      label: "Contato",
      href: "/contato",
    },
    {
      label: "Localização",
      href: "/localizacao",
    },
    {
      label: "Baixar App",
      href: "/baixar-app",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
