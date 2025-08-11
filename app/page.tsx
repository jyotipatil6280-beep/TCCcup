"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, ArrowRight, BarChart3, Clock, Users, Target, Zap } from "lucide-react"
import PageLayout from "../components/page-layout"
import { useState, useEffect } from "react"

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93-.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const today = new Date()
      today.setHours(19, 30, 0, 0)

      const istOffset = 5.5 * 60 * 60 * 1000
      const now = new Date()
      const istNow = new Date(now.getTime() + istOffset)
      const istTarget = new Date(today.getTime() + istOffset)

      const difference = istTarget.getTime() - istNow.getTime()

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ hours, minutes, seconds })
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex justify-center gap-4 mb-8">
      <div className="relative">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[80px] text-center border border-white/20 shadow-xl">
          <div className="text-3xl font-bold text-white mb-1">{String(timeLeft.hours).padStart(2, "0")}</div>
          <div className="text-xs text-gray-300 uppercase tracking-wider">Hours</div>
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
      </div>
      <div className="relative">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[80px] text-center border border-white/20 shadow-xl">
          <div className="text-3xl font-bold text-white mb-1">{String(timeLeft.minutes).padStart(2, "0")}</div>
          <div className="text-xs text-gray-300 uppercase tracking-wider">Minutes</div>
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      </div>
      <div className="relative">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[80px] text-center border border-white/20 shadow-xl">
          <div className="text-3xl font-bold text-white mb-1">{String(timeLeft.seconds).padStart(2, "0")}</div>
          <div className="text-xs text-gray-300 uppercase tracking-wider">Seconds</div>
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <PageLayout>
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-teal-600/20 backdrop-blur-3xl"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="relative inline-block">
              <img
                src="https://i.ibb.co/jkVCpXPv/TCC-LOGO.png"
                alt="Twitter Community Cup Logo"
                className="w-40 h-32 mx-auto mb-6 object-contain drop-shadow-2xl"
              />
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/30 to-teal-400/30 rounded-full blur-xl"></div>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-white via-blue-200 to-teal-200 bg-clip-text text-transparent mb-6 tracking-tight">
            Twitter Community Cup
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the ultimate BGMI tournament with cutting-edge gameplay, professional streaming, and incredible
            prizes.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="https://www.youtube.com/watch?v=IKVtR2zpMog" target="_blank" rel="noopener noreferrer">
              <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl text-lg shadow-2xl py-4 px-8 transition-all duration-300 transform hover:scale-105 font-bold border-0">
                <div className="flex items-center gap-3">
                  <YouTubeIcon className="w-6 h-6 text-white" />
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    WATCH LIVE
                  </span>
                </div>
              </Button>
            </Link>

            <Link href="/stats">
              <Button className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 py-4 px-8 rounded-2xl text-lg shadow-xl transition-all duration-300 transform hover:scale-105">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Statistics
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white">32</div>
              <div className="text-sm text-gray-400">Teams</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white">₹5000</div>
              <div className="text-sm text-gray-400">Prize Pool</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white">2</div>
              <div className="text-sm text-gray-400">Days</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white">LIVE</div>
              <div className="text-sm text-gray-400">Status</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Tournament Features</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Discover what makes this tournament special</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">₹5000 Prize</h3>
                <p className="text-gray-400 leading-relaxed">Massive rewards awaiting the champions</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">SMASH RULE</h3>
                <p className="text-gray-400 leading-relaxed">Unique gameplay mechanics for intense action</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">RONDO MAP</h3>
                <p className="text-gray-400 leading-relaxed">Exclusive map experience before global release</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">LIVE STATS</h3>
                <p className="text-gray-400 leading-relaxed">Real-time performance tracking and analytics</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-teal-900/40 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10"></div>
            <CardContent className="p-12 text-center relative z-10">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">DAY 2 COUNTDOWN</h2>
              </div>
              <p className="text-xl text-gray-300 mb-8">Today at 7:30 PM IST - The battle continues!</p>
              <CountdownTimer />
              <Link href="/teams">
                <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 hover:from-blue-600 hover:via-purple-600 hover:to-teal-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-xl border-0">
                  <Users className="w-5 h-5 mr-2" />
                  View All Teams
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
