import DashboardNavbar from "@/components/Dashboard/Navbar";
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

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNavbar user={data.user} />
      <main className="flex-1 bg-gray-50 dark:bg-neutral-900">
        <div className="max-w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
