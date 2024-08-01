import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className="overflow-x-hidden bg-red" lang="pt">
        <head>
          {/* Meta tags para customizar a cor das barras de navegação */}
          <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
          <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000" />
        </head>
      <body
        className={clsx(
          "min-h-screen font-sans antialiased bg-red",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="relative flex flex-col h-screen">
            <main className="mx-auto w-full">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
