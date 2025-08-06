"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Clock, Users } from "lucide-react"
import Link from "next/link"
import PageLayout from "../../components/page-layout"

export default function RegisterPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <img
              src="https://i.ibb.co/jkVCpXPv/TCC-LOGO.png"
              alt="Twitter Community Cup Logo"
              className="w-32 h-24 mx-auto mb-6 object-contain"
            />
          </div>

          <Card className="bg-gradient-to-br from-blue-900/90 to-teal-900/90 border-gray-700 rounded-3xl">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-white mb-4">Registration Closed</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-gray-300 text-lg">
                The registration period for Twitter Community Cup has ended. Thank you to all the teams who registered!
              </p>

              <div className="bg-blue-800/30 rounded-2xl p-6 border border-cyan-500/30">
                <h3 className="text-white font-semibold mb-3">Tournament Status</h3>
                <div className="space-y-2 text-gray-300">
                  <p>✅ Registration Phase: Completed</p>
                  <p>🎮 Tournament Phase: Ongoing</p>
                  <p>📊 Live Stats: Available</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/teams">
                  <Button className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white font-bold py-3 px-6 rounded-2xl">
                    <Users className="w-5 h-5 mr-2" />
                    View Registered Teams
                  </Button>
                </Link>

                <Link href="/stats">
                  <Button
                    variant="outline"
                    className="border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 py-3 px-6 rounded-2xl bg-transparent"
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    Live Tournament Stats
                  </Button>
                </Link>
              </div>

              <div className="pt-4 border-t border-gray-600">
                <p className="text-gray-400 text-sm">
                  Follow the tournament progress and check live statistics to see how your favorite teams are
                  performing!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
