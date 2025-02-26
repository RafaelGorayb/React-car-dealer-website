import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { FaWhatsapp, FaLinkedin } from 'react-icons/fa'

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import DemoBanner from "@/components/ui/demobanner";

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
    { media: "(prefers-color-scheme: dark)", color: "white" },
  ],
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className="overflow-x-hidden" lang="pt">
      <head />
      <body
        className={clsx(
          "min-h-screen relative bg-background font-sans antialiased",
          fontSans.variable
        )}
      >

        
      {/* <DemoBanner /> */}
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="relative flex flex-col h-screen">

            <main className="mx-auto w-full">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
