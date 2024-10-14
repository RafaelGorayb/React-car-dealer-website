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

      <div className="rounded-tl-2xl border border-neutral-200 bg-white flex flex-col gap-2 flex-1 w-full h-full">
        <div className="w-full h-full">{children}</div>
 
    </div>
  );

  return (
    <section>
      <SidebarMenu user={data.user} children={<Dashboard />} />
    </section>
  );
}
