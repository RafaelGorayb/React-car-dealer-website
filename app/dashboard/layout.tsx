import SidebarMenu from "@/components/Dashboard/Sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="w-full h-full">{children}</div>
      </div>
    </div>
  );

  return (
    <section>
      <SidebarMenu user={data.user} children={<Dashboard />} />
    </section>
  );
}
