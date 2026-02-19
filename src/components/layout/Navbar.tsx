"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Globe, Menu, X, Search, ChevronDown, User } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHome = pathname === '/'
  const isTransparent = isHome && !isScrolled

  const navLinks = [
    { href: "/", label: "Home" },
    {
      href: "/packages",
      label: "Package",
      hasDropdown: true,
    },
    {
      href: "/destinations",
      label: "Destination",
      hasDropdown: true,
    },
    {
      href: "/blog",
      label: "Blog",
      hasDropdown: true,
    },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isTransparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 md:h-18 items-center justify-between gap-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
          >
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <Globe className="h-5 w-5" />
            </div>
            <span
              className={cn(
                "text-xl font-black tracking-tight hidden sm:block",
                isTransparent ? "text-white" : "text-gray-900"
              )}
            >
              TravelNest
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-0.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  isTransparent
                    ? pathname === link.href
                      ? "text-white font-semibold"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                    : pathname === link.href
                    ? "text-gray-900 font-semibold bg-gray-100"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {link.label}
                {link.hasDropdown && (
                  <ChevronDown className="h-3.5 w-3.5 mt-0.5 opacity-60" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              className={cn(
                "p-2 rounded-full transition-all",
                isTransparent
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              )}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {session ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                    isTransparent
                      ? "text-white/90 hover:bg-white/10"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-5 py-2 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    isTransparent
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-all shadow-md"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className={cn(
              "md:hidden p-2 rounded-lg",
              isTransparent ? "text-white" : "text-gray-700"
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium",
                  pathname === link.href
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {link.label}
                {link.hasDropdown && <ChevronDown className="h-4 w-4 opacity-60" />}
              </Link>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-3 flex flex-col gap-2">
              {session ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}
                    className="text-center py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm"
                  >
                    Dashboard
                  </Link>
                  <button onClick={() => signOut()}
                    className="py-3 px-4 rounded-xl bg-black text-white font-semibold text-sm"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)}
                    className="text-center py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm"
                  >
                    Log in
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}
                    className="text-center py-3 px-4 rounded-xl bg-black text-white font-semibold text-sm"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
