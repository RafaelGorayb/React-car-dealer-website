import SidebarMenu from "@/components/Dashboard/Sidebar";
import { Viewport } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "white" },
  ],
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  if (!data?.user) {
    redirect("/login");
  }

  const Dashboard = () => (
<div className="flex flex-1 "> 
      <div className="rounded-tl-2xl border border-neutral-200 bg-white flex flex-col gap-2 flex-1 w-full">
        <div className="flex-1">{children}</div>
    </div>
  </div>
  );

  return (
    <div className="w-full">
      <SidebarMenu user={data.user} children={<Dashboard />} />
    </div>
  );
}
