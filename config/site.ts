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
    }
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
    }
  ],
};

export const dashboardConfig = {
  name: "Akkar Admin panel",
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
