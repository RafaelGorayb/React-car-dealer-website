"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { LayoutDashboard, Archive, Bolt, Menu, X, ChevronDown } from "lucide-react";
import LogoutButton from "./logoutButton";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface NavbarProps {
  user: User;
}

const DashboardNavbar: React.FC<NavbarProps> = ({ user }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={16} />,
    },
    {
      label: "Estoque",
      href: "/dashboard/estoque",
      icon: <Archive size={16} />,
    },
    {
      label: "Configurações",
      href: "/dashboard/settings",
      icon: <Bolt size={16} />,
    },
  ];

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      if (user?.user_metadata?.avatar_url) {
        const { data, error } = await supabase.storage
          .from("usuarios")
          .createSignedUrl(user.user_metadata.avatar_url, 60);

        if (error) {
          console.error("Error fetching avatar URL:", error);
        } else {
          setAvatarUrl(data.signedUrl);
        }
      }
    };

    fetchAvatarUrl();
  }, [user]);

  return (
    <nav className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="font-bold text-xl">
                AKKAR
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {links.map((link, idx) => {
                const isActive = pathname === link.href || 
                  (link.href !== "/dashboard" && pathname.startsWith(link.href));
                
                return (
                  <div key={idx} className="relative pt-6">
                    <Link
                      href={link.href}  
                      className={cn(
                        "inline-flex items-center text-sm font-medium border-transparent",
                        isActive 
                          ? "text-black-600 p-2 dark:text-black-400" 
                          : "text-gray-900 dark:text-gray-100 p-2 hover:text-gray-500 hover:bg-gray-100 dark:hover:text-gray-300 rounded-md"
                      )}
                    >
                      <span className="mr-2">{link.icon}</span>
                      {link.label}
                    </Link>
                    {isActive && (
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                        layoutId="navbar-indicator"
                        transition={{ 
                          type: "spring", 
                          damping: 15
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* User profile dropdown */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 text-sm rounded-full focus:outline-none"
                id="user-menu-button"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <span className="sr-only">Open user menu</span>
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={user.email as string}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.user_metadata?.displayName ||
                    user?.user_metadata?.full_name ||
                    user.email?.split('@')[0]}
                </span>
                <ChevronDown size={16} />
              </button>

              {/* Dropdown menu */}
              {userMenuOpen && (
                <div
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-neutral-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700"></div>
                  <Link
                    href="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Configurações
                  </Link>
                  <div className="border-t border-gray-200 dark:border-gray-700"></div>
                  <div className="px-4 py-2">
                    <LogoutButton />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 pt-2 pb-3">
            {links.map((link, idx) => {
              const isActive = pathname === link.href || 
                (link.href !== "/dashboard" && pathname.startsWith(link.href));
              
              return (
                <div key={idx} className="relative">
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-base font-medium border-l-4",
                      isActive
                        ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "border-transparent text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-neutral-800"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.label}
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-3">
            <div className="flex items-center px-4">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={user.email as string}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                  {user?.user_metadata?.displayName ||
                    user?.user_metadata?.full_name ||
                    user.email?.split('@')[0]}
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {user.email}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                href="/dashboard/settings"
                className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Configurações
              </Link>
              <div className="px-4 py-2">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default DashboardNavbar; 