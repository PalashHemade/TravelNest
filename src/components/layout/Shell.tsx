"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDashboard = pathname?.startsWith("/dashboard");
  const isAdmin = pathname?.startsWith("/admin");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  const showNavbar = !isAdmin && !isAuthPage; // Show navbar on dashboard, but not admin/auth
  const showFooter = !isDashboard && !isAdmin && !isAuthPage;

  return (
    <>
      {showNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </>
  );
}
