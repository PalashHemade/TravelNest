import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative bg-slate-50 dark:bg-slate-950">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <AdminSidebar />
      </div>
      <main className="md:pl-72 min-h-screen">
        <div className="px-4 md:px-8 pt-6">
            {children}
        </div>
      </main>
    </div>
  );
}
