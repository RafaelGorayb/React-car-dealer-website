import { LayoutDashboard, Settings } from "lucide-react";
import NextLink from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import LogoutButton from "./logoutButton";

const SidebarMenu = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">AKKAR</h1>
      </div>
      <div className="p-4 border-b border-gray-200 flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
        <div>
          <p className="font-medium text-gray-800">{data.user.email}</p>
          <p className="text-sm text-gray-500">{data.user.role}</p>
        </div>
      </div>
      <nav className="flex-grow">
        <ul className="p-2">
          <li className="mb-1">
            <NextLink
              href="/dashboard"
              className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              <LayoutDashboard className="mr-3" size={20} />
              <span>Dashboard</span>
            </NextLink>
          </li>
          <li className="mb-1">
            <NextLink
              href="/dashboard/estoque"
              className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              <span className="w-5 h-5 mr-3 flex items-center justify-center">
                E
              </span>
              <span>Estoque</span>
            </NextLink>
          </li>
        </ul>
      </nav>
      <div className="flex flex-row justify-between p-4 border-t border-gray-200">
        <a
          href="/dashboard/settings"
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <Settings className="mr-3" size={20} />
          <span>Settings</span>
        </a>
        <LogoutButton />
      </div>
    </div>
  );
};

export default SidebarMenu;
