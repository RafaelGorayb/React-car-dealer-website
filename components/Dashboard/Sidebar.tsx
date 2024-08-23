"use client";
import { Archive, Bolt, LayoutDashboard } from "lucide-react";
import LogoutButton from "./logoutButton";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

interface SidebarMenuProps {
  user: User;
  children: React.ReactNode;
}

const SidebarMenu = ({ user, children }: SidebarMenuProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const supabase = createClient();

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Estoque",
      href: "/dashboard/estoque",
      icon: <Archive size={20} />,
    },
    {
      label: "Configurações",
      href: "/dashboard/settings",
      icon: <Bolt size={20} />,
    },
  ];

  const [open, setOpen] = React.useState(false);

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
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            AKKAR
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-2">
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
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  {user?.user_metadata?.displayName ||
                    user?.user_metadata?.full_name}
                </span>
                <span className="flex text-xs gap-16 text-neutral-500 dark:text-neutral-400">
                  {user?.email}
                  <LogoutButton />
                </span>
              </div>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
};

export default SidebarMenu;
