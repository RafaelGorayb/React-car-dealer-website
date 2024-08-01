export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Akkar Motors",
  description: "A melhor loja de carros do Brasil",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Comparador",
      href: "/comparador",
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
      label: "Comparador",
      href: "/comparador",
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
};

export const dashboardConfig = {
  name: "Akkar Motors",
  description: "Admin page",
  navItems: [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Estoque",
      href: "/dashboard/estoque",
    },
  ],
  navMenuItems: [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Estoque",
      href: "/dashboard/estoque",
    },
  ],
};
