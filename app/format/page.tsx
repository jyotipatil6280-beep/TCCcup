"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Calendar, Award, Map, Zap } from "lucide-react"
import PageLayout from "../../components/page-layout"

export default function FormatPage() {
  const mapRotation = [
    { match: 1, map: "RONDO" },
    { match: 2, map: "Erangel" },
    { match: 3, map: "Erangel" },
    { match: 4, map: "Erangel" },
    { match: 5, map: "Miramar" },
    { match: 6, map: "Miramar" },
  ]

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-300 via-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            Tournament Format
          </h1>
          <p className="text-gray-300 text-lg">Twitter Community Cup: August 11th - 13th, 2025</p>
        </div>

        <div className="grid gap-8 max-w-4xl mx-auto">
          {/* Tournament Overview */}
          <Card className="bg-gradient-to-br from-blue-900/90 to-teal-900/90 border-gray-700 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-cyan-400" />
                Tournament Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-300">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-800/30 rounded-xl">
                  <h3 className="text-2xl font-bold text-cyan-400">20</h3>
                  <p className="text-white font-semibold">Teams</p>
                </div>
                <div className="text-center p-4 bg-teal-800/30 rounded-xl">
                  <h3 className="text-2xl font-bold text-green-400">18</h3>
                  <p className="text-white font-semibold">Total Matches</p>
                </div>
                <div className="text-center p-4 bg-green-800/30 rounded-xl">
                  <h3 className="text-2xl font-bold text-yellow-400">3</h3>
                  <p className="text-white font-semibold">Days</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gradient-to-r from-cyan-900/30 to-green-900/30 rounded-xl">
                <p className="text-center text-white font-semibold">6 matches per day</p>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className="bg-gradient-to-br from-blue-900/90 to-teal-900/90 border-gray-700 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-green-400" />
                Tournament Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-300">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-800/30 rounded-xl">
                  <h3 className="text-white font-semibold mb-2">Day 1</h3>
                  <p className="text-cyan-300">August 11th, 2025</p>
                  <p className="text-sm">Matches 1-6</p>
                </div>
                <div className="text-center p-4 bg-teal-800/30 rounded-xl">
                  <h3 className="text-white font-semibold mb-2">Day 2</h3>
                  <p className="text-green-300">August 12th, 2025</p>
                  <p className="text-sm">Matches 7-12</p>
                </div>
                <div className="text-center p-4 bg-green-800/30 rounded-xl">
                  <h3 className="text-white font-semibold mb-2">Day 3</h3>
                  <p className="text-yellow-300">August 13th, 2025</p>
                  <p className="text-sm">Matches 13-18 (Smash Rule)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map Rotation */}
          <Card className="bg-gradient-to-br from-blue-900/90 to-teal-900/90 border-gray-700 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Map className="w-6 h-6 text-blue-400" />
                Map Rotation (Per Day)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-300">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {mapRotation.map((item) => (
                  <div key={item.match} className="flex items-center justify-between p-3 bg-blue-800/30 rounded-xl">
                    <span className="text-white font-semibold">Match {item.match}</span>
                    <span
                      className={`font-bold ${
                        item.map === "RONDO"
                          ? "text-green-400"
                          : item.map === "Erangel"
                            ? "text-blue-400"
                            : "text-yellow-400"
                      }`}
                    >
                      {item.map}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Smash Rule */}
          <Card className="bg-gradient-to-br from-blue-900/90 to-teal-900/90 border-cyan-500/30 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Zap className="w-6 h-6 text-orange-400" />
                Smash Rule (Day 3)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-300">
              <div className="space-y-3">
                <p>1. Teams play using regular tournament rules until a team reaches the Match Point threshold.</p>
                <p>
                  2. <strong className="text-cyan-300">Match Point = Top 1's points after Match #12 + 15 points</strong>
                </p>
                <p>
                  3. Once a team reaches Match Point, they become{" "}
                  <strong className="text-green-300">"Match Point Eligible"</strong>
                </p>
                <p>
                  4.{" "}
                  <strong className="text-blue-300">
                    First Match Point Eligible team to secure a WWCD wins the tournament
                  </strong>
                </p>
                <p>5. Maximum 6 matches on Day 3 - if no WWCD by Match Point Eligible teams, highest points wins</p>
              </div>
              <div className="mt-4 p-4 bg-blue-800/30 rounded-xl border border-cyan-500/30">
                <p className="text-orange-300 font-semibold">
                  ⚡ Sudden Death Format: Win the match, win the tournament!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Prize Pool */}
          <Card className="bg-gradient-to-br from-blue-900/90 to-teal-900/90 border-cyan-500/30 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Award className="w-6 h-6 text-cyan-400" />
                Prize Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-300">
              <p className="text-center text-lg">₹5000</p>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="text-center p-4 bg-blue-800/30 rounded-xl">
                  <h3 className="text-cyan-300 font-semibold mb-2">🏆 Champion</h3>
                  <p className="text-sm">Cash Prize</p>
                </div>
                <div className="text-center p-4 bg-teal-800/30 rounded-xl">
                  <h3 className="text-green-300 font-semibold mb-2">🥈 Runner-up</h3>
                  <p className="text-sm">Cash Prize</p>
                </div>
                <div className="text-center p-4 bg-green-800/30 rounded-xl">
                  <h3 className="text-blue-300 font-semibold mb-2">🥉 Third Place</h3>
                  <p className="text-sm">Cash Prize</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400">Tournament format subject to minor adjustments based on participation</p>
        </div>
      </div>
    </PageLayout>
  )
}
