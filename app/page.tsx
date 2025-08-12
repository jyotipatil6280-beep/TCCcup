"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, ChefHatIcon, Calendar, Award, ArrowRight, BarChart3, Clock } from "lucide-react"
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
      today.setHours(19, 30, 0, 0) // 7:30 PM today

      // Convert to IST (UTC+5:30)
      const istOffset = 5.5 * 60 * 60 * 1000 // IST offset in milliseconds
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
    <div className="flex justify-center gap-3 mb-6">
      <div className="bg-gradient-to-br from-blue-800/70 to-teal-800/70 rounded-lg p-3 min-w-[60px] text-center border border-cyan-500/30">
        <div className="text-xl md:text-2xl font-bold text-cyan-300">{String(timeLeft.hours).padStart(2, "0")}</div>
        <div className="text-xs text-gray-400">Hours</div>
      </div>
      <div className="bg-gradient-to-br from-blue-800/70 to-teal-800/70 rounded-lg p-3 min-w-[60px] text-center border border-cyan-500/30">
        <div className="text-xl md:text-2xl font-bold text-green-300">{String(timeLeft.minutes).padStart(2, "0")}</div>
        <div className="text-xs text-gray-400">Minutes</div>
      </div>
      <div className="bg-gradient-to-br from-blue-800/70 to-teal-800/70 rounded-lg p-3 min-w-[60px] text-center border border-cyan-500/30">
        <div className="text-xl md:text-2xl font-bold text-yellow-300">{String(timeLeft.seconds).padStart(2, "0")}</div>
        <div className="text-xs text-gray-400">Seconds</div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - YouTube Video */}
            <div className="order-2 lg:order-1">
              <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl overflow-hidden border border-cyan-500/30 aspect-video">
                {/* YouTube Embed Placeholder */}
                {/* <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/50 to-teal-900/50">
                  <div className="text-center">
                    <YouTubeIcon className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                    <p className="text-gray-300 text-lg font-medium">Tournament Stream</p>
                    <p className="text-gray-400 text-sm">Live stream will appear here</p>
                  </div>
                </div> */}
                {/* When you have the YouTube link, replace the above div with: */}
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/jw-Fv3z0Bjc"
                  title="Tournament Stream"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Right Side - Tournament Info */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              {/* Tournament Logo */}
              <div className="mb-6 lg:mb-8">
                <img
                  src="https://i.ibb.co/jkVCpXPv/TCC-LOGO.png"
                  alt="Twitter Community Cup Logo"
                  className="w-24 h-18 lg:w-32 lg:h-24 mx-auto lg:mx-0 object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Get Ready Text */}
              <div className="mb-4">
                <p className="text-cyan-400 font-semibold text-sm lg:text-base tracking-wider uppercase">
                  Get Ready for Glory
                </p>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-white">Twitter Community</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-300 via-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Cup Season 1
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg lg:text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Prepare for the most intense gaming showdown of the year. Compete, conquer, and claim your victory in
                the ultimate BGMI tournament experience.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {/* LIVE Button */}
                <Link href="https://www.youtube.com/live/jw-Fv3z0Bjc" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 hover:from-blue-700 hover:via-teal-700 hover:to-green-700 text-white rounded-2xl text-base shadow-lg py-3 px-6 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 font-semibold">
                    <div className="flex items-center gap-3">
                      <YouTubeIcon className="w-5 h-5 text-white" />
                      <span className="flex items-center gap-2">
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
                    className="border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-300 py-3 px-6 rounded-2xl text-base bg-transparent transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 font-semibold"
                  >
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View Stats
                  </Button>
                </Link>
              </div>
            </div>
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

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-blue-900/90 to-teal-900/90 border border-cyan-500/30 rounded-3xl">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl md:text-3xl font-bold text-white">DAY 2 STARTS IN</h2>
              </div>
              <p className="text-lg text-gray-300 mb-6">Today at 7:30 PM IST - Don't miss the action!</p>
              <CountdownTimer />
              <Link href="/teams">
                <Button className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white font-bold py-3 px-6 rounded-2xl text-base transition-all duration-300 transform hover:scale-105">
                  View Registered Teams
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageLayout>
  )
}
