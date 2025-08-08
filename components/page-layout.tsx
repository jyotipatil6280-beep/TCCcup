import type React from "react"
import Navbar from "./navbar"
import Footer from "./footer"

interface PageLayoutProps {
  children: React.ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-green-800 flex flex-col">
      <Navbar />
      <main className="flex-1 border-transparent text-white">{children}</main>
      <Footer />
    </div>
  )
}
