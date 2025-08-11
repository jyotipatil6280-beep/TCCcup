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
    <nav className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 shadow-2xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <img
                src="https://i.ibb.co/jkVCpXPv/TCC-LOGO.png"
                alt="TCC Logo"
                className="h-12 w-12 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 to-teal-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-white">
              <div className="text-xl font-black tracking-wide bg-gradient-to-r from-cyan-300 via-blue-300 to-teal-300 bg-clip-text text-transparent">
                TCC | UGC
              </div>
              <div className="text-xs text-gray-400 font-medium">Tournament Platform</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 font-medium ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 text-white border border-blue-400/30 shadow-lg backdrop-blur-md"
                        : "text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{item.name}</span>
                    {isActive && <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>}
                  </Button>
                </Link>
              )
            })}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:bg-white/10 rounded-2xl p-3 transition-all duration-300 transform hover:scale-105"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-white/10">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 font-medium ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 text-white border border-blue-400/30 shadow-lg backdrop-blur-md"
                          : "text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold text-lg">{item.name}</span>
                      {isActive && <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>}
                    </Button>
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
