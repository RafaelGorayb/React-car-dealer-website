"use client";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
  Button,
} from "@nextui-org/react";

import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon, Logo } from "@/components/icons";
import { Image } from "@nextui-org/react";
import { useState } from "react";
import { SearchBar } from "./HomePage/searchBar";

export const Navbar = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  const searchInput = isSearchExpanded ? (
    <SearchBar isExpanded={isSearchExpanded} onToggle={toggleSearch} />
  ) : (
    <Button
      isIconOnly
      variant="faded"
      aria-label="pesquisar"
      onClick={toggleSearch}
    >
      <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
    </Button>
  );

  return (
    <NextUINavbar 
              maxWidth="xl"  
              className="bg-white dark:bg-black border border-white dark:border-black " 
              >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Image src="/logo-akkar.png" alt="Logo" className="h-6" />
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-center ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        {/* <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem> */}
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        {/* <ThemeSwitch /> */}
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <SearchBar isExpanded={true} />
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
