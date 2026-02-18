import { DashboardSidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative pt-16">
      <div className="hidden h-[calc(100vh-4rem)] md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 md:top-16 z-[40] bg-gray-900">
        <DashboardSidebar />
      </div>
      <main className="md:pl-72 pb-10 h-full">
        <div className="px-4 md:px-8 pt-6 h-full">
            {children}
        </div>
      </main>
    </div>
  );
}
