"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingBag, Settings, LogOut, Shield, PlusCircle, Sparkles } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const routes = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-sky-500",
    },
    {
      label: "My Bookings",
      icon: ShoppingBag,
      href: "/dashboard/bookings",
      color: "text-violet-500",
    },
    {
      label: "New Booking",
      icon: PlusCircle,
      href: "/dashboard/bookings/new",
      color: "text-green-500",
    },
    {
      label: "Custom Package",
      icon: Sparkles,
      href: "/dashboard/custom-request",
      color: "text-amber-500",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      color: "text-gray-500",
    },
  ];

  if (session?.user?.role === 'admin') {
      routes.push({
          label: "Admin Panel",
          icon: Shield,
          href: "/admin",
          color: "text-red-500",
      });
  }

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-secondary/10 dark:bg-secondary/5 border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === route.href ? "text-primary bg-primary/10" : "text-muted-foreground"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
         <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/10" onClick={() => signOut()}>
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
         </Button>
      </div>
    </div>
  );
}
