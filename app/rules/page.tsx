"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, AlertTriangle, Users, Clock, Settings, Trophy } from "lucide-react"
import PageLayout from "../../components/page-layout"

export default function RulesPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-300 via-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            Tournament Rules
          </h1>
          <p className="text-gray-300 text-lg">Official Twitter Community Cup Rules & Regulations</p>
        </div>

        <div className="grid gap-8 max-w-4xl mx-auto">
          {/* General Rules */}
          <Card className="bg-gradient-to-br from-blue-900/90 to-teal-900/90 border-gray-700 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-cyan-400" />
                General Understanding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-300">
              <p>
                By participating in this tournament, you agree to these general rules and the competition-specific rules
                applicable to this tournament.
              </p>
            </CardContent>
          </Card>

          {/* Match Parameters */}
          <Card className="bg-gradient-to-br from-blue-900/90 to-teal-900/90 border-gray-700 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Settings className="w-6 h-6 text-green-400" />
                Match Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-300">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p>
                    <strong className="text-white">Mode:</strong> Third Person Perspective (TPP)
                  </p>
                  <p>
                    <strong className="text-white">Playzone Shrink Speed:</strong> x1.1
                  </p>
                  <p>
                    <strong className="text-white">Red Zone & Flare Guns:</strong> Disabled
                  </p>
                  <p>
                    <strong className="text-white">Aim Assist & Sound Visualization:</strong> Off
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong className="text-white">Safe Zone 1 Display Time:</strong>
                  </p>
                  <p className="ml-4">• 80s for Miramar & Erangel</p>
                  <p className="ml-4">• 80s for RONDO</p>
                  <p>
                    <strong className="text-white">ALL Weapons:</strong> x2
                  </p>
                  <p>
                    <strong className="text-white">Scopes and Magazines:</strong> x2
                  </p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-800/30 rounded-xl">
                <p className="text-cyan-300">
                  <strong>Note:</strong> Changing between TPP and FPP in the game is allowed
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Match Information */}
          <Card className="bg-gradient-to-br from-blue-900/90 to-teal-900/90 border-gray-700 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-400" />
                Match Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-300">
              <p>Before every match, the lobby IDs and passwords will be posted on the tournament's WhatsApp group.</p>
              <div className="space-y-2">
                <p>• Players need to enter these to enter the custom match lobbies</p>
                <p>• Each team needs to be in specific slots that will be announced by the admin team</p>
                <p>• Being in the wrong slot when the match starts may cause your points to be lost for that match</p>
              </div>
            </CardContent>
          </Card>

          {/* Stoppage of Play */}
          <Card className="bg-gradient-to-br from-blue-900/90 to-teal-900/90 border-gray-700 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Clock className="w-6 h-6 text-yellow-400" />
                Stoppage of Play
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-300">
              <p>
                <strong className="text-red-400">
                  No pause will be permitted during Tournament play for any reason.
                </strong>
              </p>
            </CardContent>
          </Card>

          {/* In-Game Rules */}
          <Card className="bg-gradient-to-br from-blue-900/90 to-teal-900/90 border-cyan-500/30 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
                In-Game Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-300">
              <div className="space-y-3">
                <p>
                  • <strong className="text-orange-300">Unregistered Players can lead to team disqualification</strong>
                </p>
                <p>• Teams must take a screenshot of every result</p>
                <p>• All 3 maps must be downloaded by all the players</p>
                <p>
                  •{" "}
                  <strong className="text-cyan-300">
                    Participants are required to play all games in order to be eligible for the prize winnings
                  </strong>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Actions */}
          <Card className="bg-gradient-to-br from-blue-900/90 to-teal-900/90 border-cyan-500/30 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
                Prohibited Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-300">
              <p>• Use of any third-party software or hacks</p>
              <p>• Teaming with other squads during matches</p>
              <p>• Toxic behavior or inappropriate language</p>
              <p>• Stream sniping or ghosting</p>
              <p>• Account sharing or using multiple accounts</p>
              <p className="text-red-400 font-semibold">
                • <strong>Self revive is strictly prohibited</strong> - Using self revive in any match will result in
                deduction of all match points for that match
              </p>
              <p className="text-orange-300 font-semibold">
                Violation of any rule will result in immediate disqualification
              </p>
            </CardContent>
          </Card>

          {/* Points Distribution */}
          <Card className="bg-gradient-to-br from-blue-900/90 to-teal-900/90 border-gray-700 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Points Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-gray-300">
              <div>
                <h3 className="text-white font-semibold mb-3">Placement Points</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 bg-yellow-900/20 rounded">
                      <span>1st Place</span>
                      <span className="text-yellow-400 font-bold">10 points</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-800/20 rounded">
                      <span>2nd Place</span>
                      <span className="text-gray-300 font-bold">6 points</span>
                    </div>
                    <div className="flex justify-between p-2 bg-orange-900/20 rounded">
                      <span>3rd Place</span>
                      <span className="text-orange-400 font-bold">5 points</span>
                    </div>
                    <div className="flex justify-between p-2 bg-blue-800/20 rounded">
                      <span>4th Place</span>
                      <span className="text-blue-400 font-bold">4 points</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 bg-green-900/20 rounded">
                      <span>5th Place</span>
                      <span className="text-green-400 font-bold">3 points</span>
                    </div>
                    <div className="flex justify-between p-2 bg-teal-900/20 rounded">
                      <span>6th Place</span>
                      <span className="text-teal-400 font-bold">2 points</span>
                    </div>
                    <div className="flex justify-between p-2 bg-purple-900/20 rounded">
                      <span>7th - 8th Place</span>
                      <span className="text-purple-400 font-bold">1 point</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-700/20 rounded">
                      <span>9th - 20th Place</span>
                      <span className="text-gray-400 font-bold">0 points</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">Elimination Points</h3>
                <div className="p-4 bg-cyan-900/20 rounded-xl">
                  <p className="text-cyan-300 font-bold text-lg">1 point per elimination</p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">Tie-Breaking Rules</h3>
                <div className="space-y-2 text-sm">
                  <p>Match ranking ties are broken in the following order:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Total number of WWCDs across all matches</li>
                    <li>Total number of Placement Points across all matches</li>
                    <li>Total number of Elimination Points across all matches</li>
                    <li>The best Placement Ranking in the most recent match</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400">For any rule clarifications, contact the tournament organizers</p>
        </div>
      </div>
    </PageLayout>
  )
}
