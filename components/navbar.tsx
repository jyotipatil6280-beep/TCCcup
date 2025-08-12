"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Users, FileText, Table, Home, BarChart3 } from "lucide-react"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Rules", href: "/rules", icon: FileText },
  { name: "Format", href: "/format", icon: Table },
  { name: "Stats", href: "/stats", icon: BarChart3 },
  { name: "Teams", href: "/teams", icon: Users },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-gradient-to-r from-blue-900/95 to-teal-900/95 backdrop-blur-sm border-b sticky top-0 z-50 border-transparent">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <img
              src="https://i.ibb.co/jkVCpXPv/TCC-LOGO.png"
              alt="TCC Logo"
              className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            />
            <div className="text-white">
              <div className="text-lg font-extrabold tracking-wide text-cyan-300 transition-all duration-300 group-hover:text-cyan-200">
                {"TCC | UGC"}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500/20 to-green-500/20 text-cyan-300 border border-cyan-500/30 shadow-md"
                        : "text-gray-300 hover:text-cyan-300 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-teal-500/10"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 transition-transform duration-300 ${isActive ? "" : "hover:rotate-12"}`}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white transition-all duration-300 hover:scale-110 hover:rotate-180 hover:!bg-cyan-500/10 hover:!text-cyan-300"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700 animate-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col space-y-2">
              {navigation.map((item, index) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <div
                      style={{ animationDelay: `${index * 50}ms` }}
                      className={`w-full justify-start flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:translate-x-2 animate-in slide-in-from-left-4 cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-500/20 to-green-500/20 text-cyan-300 border border-cyan-500/30"
                          : "text-gray-300 hover:text-cyan-300 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-teal-500/10"
                      }`}
                    >
                      <Icon className="w-4 h-4 transition-transform duration-300 hover:rotate-12" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
