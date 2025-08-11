"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, ChefHatIcon, Calendar, Award, ArrowRight, BarChart3 } from "lucide-react"
import PageLayout from "../components/page-layout"

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93-.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

export default function HomePage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <img
              src="https://i.ibb.co/jkVCpXPv/TCC-LOGO.png"
              alt="Twitter Community Cup Logo"
              className="w-32 h-24 mx-auto mb-6 object-contain"
            />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-300 via-green-400 to-emerald-400 bg-clip-text text-transparent mb-6">
            Twitter Community Cup
          </h1>

          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Join the ultimate BGMI tournament experience. Compete with the best teams, showcase your skills, and win
            amazing prizes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* LIVE Button */}
            <Link
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="link"
                className="bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 hover:from-blue-700 hover:via-teal-700 hover:to-green-700 text-white rounded-2xl text-base shadow-lg py-2.5 transition-all duration-300 transform hover:scale-105 font-semibold px-4"
              >
                <div className="flex items-center gap-3">
                  <YouTubeIcon className="w-5 h-5 text-white" />
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                    LIVE
                  </span>
                </div>
              </Button>
            </Link>

            {/* Stats Button */}
            <Link href="/stats">
              <Button
                variant="outline"
                className="border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 py-4 px-8 rounded-2xl text-lg bg-transparent"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View Stats
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">Tournament Highlights</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-800/50 to-teal-800/50 border border-cyan-500/30 rounded-2xl">
              <CardContent className="p-6 text-center">
                <Trophy className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{"₹5000"}</h3>
                <p className="text-gray-300">Exciting rewards for winners</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-800/50 to-teal-800/50 border border-cyan-500/30 rounded-2xl">
              <CardContent className="p-6 text-center">
                <ChefHatIcon className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">SMASH RULE!!</h3>
                <p className="text-gray-300">More About It In Format Section</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-800/50 to-teal-800/50 border border-cyan-500/30 rounded-2xl">
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">RONDO MAP</h3>
                <p className="text-gray-300">Even before PUBG MOBILE</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-800/50 to-teal-800/50 border border-cyan-500/30 rounded-2xl">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{"LIVE STATS"}</h3>
                <p className="text-gray-300">{"Check it Out Via Stats!!!"}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-blue-900/90 to-teal-900/90 border border-cyan-500/30 rounded-3xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Registration Period Ended</h2>
              <p className="text-xl text-gray-300 mb-8">
                Thank you to all teams who registered! Tournament matches are now underway.
              </p>
              <Link href="/teams">
                <Button className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105">
                  View Registered Teams
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageLayout>
  )
}

      
