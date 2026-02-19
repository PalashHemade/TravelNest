import Link from "next/link"
import { Globe, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-950 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black">TravelNest</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Explore the world with what you love. Beautiful natural scenery, exotic destinations, and curated experiences await.
            </p>
            <div className="flex gap-3 mt-5">
              {["F", "T", "in"].map((s) => (
                <a key={s} href="#"
                  className="h-9 w-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-white hover:text-white transition-all text-xs font-bold"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Explore</h3>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Destinations", href: "/destinations" },
                { label: "Packages", href: "/packages" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="h-4 w-4 text-gray-500 shrink-0" />
                +62 6943 6956
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="h-4 w-4 text-gray-500 shrink-0" />
                hello@travelnest.com
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="h-4 w-4 text-gray-500 shrink-0 mt-0.5" />
                <span>123 Travel Lane,<br/>Adventure City, AC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} TravelNest. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
