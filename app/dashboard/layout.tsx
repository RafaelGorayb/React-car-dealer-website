import SidebarMenu from "@/components/Dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-row">
      <SidebarMenu />
      <div>{children}</div>
    </section>
  );
}
