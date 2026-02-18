"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Package, Calendar, Settings, LogOut, FileText, ArrowLeft, MapPin, ClipboardList } from "lucide-react";
import { signOut } from "next-auth/react";

export function AdminSidebar() {
  const pathname = usePathname();

  const routes = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      href: "/admin",
      color: "text-sky-500",
    },
    {
      label: "Destinations",
      icon: MapPin,
      href: "/admin/destinations",
      color: "text-green-500",
    },
    {
      label: "Packages",
      icon: Package,
      href: "/admin/packages",
      color: "text-pink-700",
    },
    {
      label: "Bookings",
      icon: Calendar,
      href: "/admin/bookings",
      color: "text-violet-500",
    },
    {
      label: "Custom Requests",
      icon: ClipboardList,
      href: "/admin/custom-requests",
      color: "text-amber-500",
    },
    {
      label: "Users",
      icon: Users,
      href: "/admin/users",
      color: "text-orange-700",
    },
    {
      label: "Blogs",
      icon: FileText,
      href: "/admin/blogs",
      color: "text-emerald-500",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
      color: "text-gray-500",
    },
  ];

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white border-r border-slate-800">
      <div className="px-3 py-2 flex-1">
        <Link href="/admin" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
          
           <div className="pt-8">
             <Link href="/dashboard" className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition text-zinc-400">
                 <ArrowLeft className="h-5 w-5 mr-3" />
                 Back to Site
             </Link>
           </div>
        </div>
      </div>
      <div className="px-3 py-2">
         <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={() => signOut()}>
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
         </Button>
      </div>
    </div>
  );
}
