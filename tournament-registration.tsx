"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  X,
  Plus,
  Users,
  Trophy,
  Instagram,
  Twitter,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { supabase } from "./lib/supabase"

interface Player {
  id: string
  inGameName: string
  instagramId: string
  twitterId: string
}

interface TeamData {
  teamName: string
  teamLogo: File | null
  teamLeaderIGN: string
  teamLeaderInstagram: string
  teamLeaderTwitter: string
  players: Player[]
}

export default function Component() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [teamData, setTeamData] = useState<TeamData>({
    teamName: "",
    teamLogo: null,
    teamLeaderIGN: "",
    teamLeaderInstagram: "",
    teamLeaderTwitter: "",
    players: [
      { id: "1", inGameName: "", instagramId: "", twitterId: "" },
      { id: "2", inGameName: "", instagramId: "", twitterId: "" },
      { id: "3", inGameName: "", instagramId: "", twitterId: "" },
      { id: "4", inGameName: "", instagramId: "", twitterId: "" },
    ],
  })

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setTeamData((prev) => ({ ...prev, teamLogo: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addPlayer = () => {
    if (teamData.players.length < 5) {
      setTeamData((prev) => ({
        ...prev,
        players: [
          ...prev.players,
          {
            id: Date.now().toString(),
            inGameName: "",
            instagramId: "",
            twitterId: "",
          },
        ],
      }))
    }
  }

  const removePlayer = (id: string) => {
    if (teamData.players.length > 4) {
      setTeamData((prev) => ({
        ...prev,
        players: prev.players.filter((player) => player.id !== id),
      }))
    }
  }

  const updatePlayer = (id: string, field: keyof Player, value: string) => {
    setTeamData((prev) => ({
      ...prev,
      players: prev.players.map((player) => (player.id === id ? { ...player, [field]: value } : player)),
    }))
  }

  const validateStep1 = () => {
    if (!teamData.teamName.trim()) {
      alert("Team name is required!")
      return false
    }
    if (!teamData.teamLogo) {
      alert("Team logo is required!")
      return false
    }
    if (!teamData.teamLeaderIGN.trim()) {
      alert("Team leader IGN is required!")
      return false
    }
    if (!teamData.teamLeaderInstagram.trim() && !teamData.teamLeaderTwitter.trim()) {
      alert("Team leader must have either Instagram or Twitter handle!")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    for (let i = 0; i < teamData.players.length; i++) {
      const player = teamData.players[i]
      if (!player.inGameName.trim()) {
        alert(`Player ${i + 1} in-game name is required!`)
        return false
      }
      if (!player.instagramId.trim() && !player.twitterId.trim()) {
        alert(`Player ${i + 1} must have either Instagram or Twitter ID!`)
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
    }
  }

  const uploadTeamLogo = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage.from("team-logos").upload(fileName, file)

      if (error) {
        console.error("Error uploading logo:", error)
        return null
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("team-logos").getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error("Error uploading logo:", error)
      return null
    }
  }

  const handleSubmit = async () => {
    if (!validateStep2()) return

    setIsSubmitting(true)

    try {
      // Upload team logo
      let logoUrl = null
      if (teamData.teamLogo) {
        logoUrl = await uploadTeamLogo(teamData.teamLogo)
        if (!logoUrl) {
          alert("Failed to upload team logo. Please try again.")
          setIsSubmitting(false)
          return
        }
      }

      // Insert team data
      const { data: teamResult, error: teamError } = await supabase
        .from("teams")
        .insert({
          team_name: teamData.teamName,
          team_logo_url: logoUrl,
          team_leader_ign: teamData.teamLeaderIGN,
          team_leader_instagram: teamData.teamLeaderInstagram || null,
          team_leader_twitter: teamData.teamLeaderTwitter || null,
        })
        .select()
        .single()

      if (teamError) {
        console.error("Error inserting team:", teamError)
        alert("Failed to register team. Please try again.")
        setIsSubmitting(false)
        return
      }

      // Insert players data
      const playersData = teamData.players.map((player, index) => ({
        team_id: teamResult.id,
        player_name: player.inGameName,
        instagram_handle: player.instagramId || null,
        twitter_handle: player.twitterId || null,
        player_order: index + 1,
      }))

      const { error: playersError } = await supabase.from("players").insert(playersData)

      if (playersError) {
        console.error("Error inserting players:", playersError)
        alert("Failed to register players. Please try again.")
        setIsSubmitting(false)
        return
      }

      console.log("Team registered successfully:", teamResult)
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setCurrentStep(1)
    setShowSuccessModal(false)
    setTeamData({
      teamName: "",
      teamLogo: null,
      teamLeaderIGN: "",
      teamLeaderInstagram: "",
      teamLeaderTwitter: "",
      players: [
        { id: "1", inGameName: "", instagramId: "", twitterId: "" },
        { id: "2", inGameName: "", instagramId: "", twitterId: "" },
        { id: "3", inGameName: "", instagramId: "", twitterId: "" },
        { id: "4", inGameName: "", instagramId: "", twitterId: "" },
      ],
    })
    setLogoPreview(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-green-800 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-40 h-32 flex items-center justify-center p-4">
              <img
                src="https://i.ibb.co/jkVCpXPv/TCC-LOGO.png"
                alt="Tournament Logo"
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-300 via-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            Team Registration
          </h1>
          <p className="text-gray-300 text-lg">Register your squad for the ultimate BGMI tournament experience</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                currentStep >= 1
                  ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                  : "bg-gray-600 text-gray-400"
              }`}
            >
              1
            </div>
            <div
              className={`w-16 h-1 ${currentStep >= 2 ? "bg-gradient-to-r from-blue-500 to-green-500" : "bg-gray-600"}`}
            ></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                currentStep >= 2
                  ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                  : "bg-gray-600 text-gray-400"
              }`}
            >
              2
            </div>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-blue-900/90 to-teal-900/90 border-gray-700 backdrop-blur-sm rounded-3xl">
          {/* Step 1: Team Details */}
          {currentStep === 1 && (
            <>
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                  <Trophy className="w-6 h-6 text-cyan-400" />
                  Team Information
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your team details and leader information
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* Team Name */}
                <div className="space-y-2">
                  <Label htmlFor="teamName" className="text-white text-lg font-semibold">
                    Team Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="teamName"
                    value={teamData.teamName}
                    onChange={(e) => setTeamData((prev) => ({ ...prev, teamName: e.target.value }))}
                    placeholder="Enter your squad name"
                    className="bg-blue-900/50 border-gray-600 text-white placeholder-gray-400 rounded-2xl h-12 text-lg focus:border-green-400 focus:ring-green-400"
                  />
                </div>

                {/* Team Logo */}
                <div className="space-y-4">
                  <Label className="text-white text-lg font-semibold">
                    Team Logo <span className="text-red-400">*</span>
                  </Label>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="flex items-center justify-center w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-dashed border-gray-600 rounded-3xl cursor-pointer hover:border-green-400 transition-colors group"
                      >
                        {logoPreview ? (
                          <img
                            src={logoPreview || "/placeholder.svg"}
                            alt="Team logo preview"
                            className="w-full h-full object-cover rounded-3xl"
                          />
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400 group-hover:text-cyan-400" />
                        )}
                      </label>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-300 mb-2">Upload your team logo</p>
                      <p className="text-sm text-gray-500">Recommended: Square image, max 5MB</p>
                      {teamData.teamLogo && (
                        <Badge variant="secondary" className="mt-2 bg-cyan-900/50 text-cyan-300 rounded-full">
                          {teamData.teamLogo.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Team Leader Details */}
                <div className="space-y-6">
                  <h3 className="text-white text-xl font-semibold">Team Leader Details</h3>

                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm">
                      Leader In-Game Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      value={teamData.teamLeaderIGN}
                      onChange={(e) => setTeamData((prev) => ({ ...prev, teamLeaderIGN: e.target.value }))}
                      placeholder="Team leader IGN"
                      className="bg-blue-900/60 border-gray-600 text-white placeholder-gray-500 rounded-xl focus:border-green-400 focus:ring-green-400"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300 text-sm flex items-center gap-1">
                        <Instagram className="w-3 h-3" />
                        Instagram Handle <span className="text-yellow-400 text-xs">(Required: IG or Twitter)</span>
                      </Label>
                      <Input
                        value={teamData.teamLeaderInstagram}
                        onChange={(e) => setTeamData((prev) => ({ ...prev, teamLeaderInstagram: e.target.value }))}
                        placeholder="@username"
                        className="bg-blue-900/60 border-gray-600 text-white placeholder-gray-500 rounded-xl focus:border-pink-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300 text-sm flex items-center gap-1">
                        <Twitter className="w-3 h-3" />
                        Twitter Handle <span className="text-yellow-400 text-xs">(Required: IG or Twitter)</span>
                      </Label>
                      <Input
                        value={teamData.teamLeaderTwitter}
                        onChange={(e) => setTeamData((prev) => ({ ...prev, teamLeaderTwitter: e.target.value }))}
                        placeholder="@username"
                        className="bg-blue-900/60 border-gray-600 text-white placeholder-gray-500 rounded-xl focus:border-blue-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 hover:from-blue-700 hover:via-teal-700 hover:to-green-700 text-white font-bold py-4 rounded-2xl text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  >
                    Next: Add Players
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: Player Details */}
          {currentStep === 2 && (
            <>
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                  <Users className="w-6 h-6 text-cyan-400" />
                  Squad Members
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Add your remaining team members (4-5 players)
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8">
                <div className="flex items-center justify-between">
                  <Label className="text-white text-lg font-semibold">Players ({teamData.players.length}/5)</Label>
                  {teamData.players.length < 5 && (
                    <Button
                      type="button"
                      onClick={addPlayer}
                      variant="outline"
                      size="sm"
                      className="bg-gradient-to-r from-emerald-500 to-green-500 border-emerald-400 text-white hover:from-green-700 hover:to-emerald-700 rounded-full"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Player
                    </Button>
                  )}
                </div>

                <div className="grid gap-6">
                  {teamData.players.map((player, index) => (
                    <Card
                      key={player.id}
                      className="bg-gradient-to-br from-blue-800/70 to-teal-700/70 border border-cyan-500/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white font-semibold flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-green-500 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md">
                              {index + 1}
                            </div>
                            Player {index + 1}
                          </h3>
                          {teamData.players.length > 4 && (
                            <Button
                              type="button"
                              onClick={() => removePlayer(player.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-gray-300 text-sm">
                              In-Game Name <span className="text-red-400">*</span>
                            </Label>
                            <Input
                              value={player.inGameName}
                              onChange={(e) => updatePlayer(player.id, "inGameName", e.target.value)}
                              placeholder="Player IGN"
                              className="bg-blue-900/60 border-gray-600 text-white placeholder-gray-500 rounded-xl focus:border-green-400 focus:ring-green-400"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-300 text-sm flex items-center gap-1">
                              <Instagram className="w-3 h-3" />
                              Instagram ID <span className="text-yellow-400 text-xs">(Required: IG or Twitter)</span>
                            </Label>
                            <Input
                              value={player.instagramId}
                              onChange={(e) => updatePlayer(player.id, "instagramId", e.target.value)}
                              placeholder="@username"
                              className="bg-blue-900/60 border-gray-600 text-white placeholder-gray-500 rounded-xl focus:border-pink-400"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-300 text-sm flex items-center gap-1">
                              <Twitter className="w-3 h-3" />
                              Twitter ID <span className="text-yellow-400 text-xs">(Required: IG or Twitter)</span>
                            </Label>
                            <Input
                              value={player.twitterId}
                              onChange={(e) => updatePlayer(player.id, "twitterId", e.target.value)}
                              placeholder="@username"
                              className="bg-blue-900/60 border-gray-600 text-white placeholder-gray-500 rounded-xl focus:border-blue-400"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50 rounded-2xl py-4 text-lg"
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 hover:from-blue-700 hover:via-teal-700 hover:to-green-700 text-white font-bold py-4 rounded-2xl text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Trophy className="w-5 h-5 mr-2" />
                        Submit Registration
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="bg-gradient-to-br from-blue-900/95 to-teal-900/95 border-gray-700 rounded-3xl max-w-md w-full">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Registration Successful!</h2>
                <p className="text-gray-300 mb-6">
                  Your team "{teamData.teamName}" has been successfully registered for the tournament. You will receive
                  a confirmation email shortly.
                </p>
                <p className="text-sm text-gray-400">Thank you for registering! Good luck in the tournament.</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-center mt-8 text-gray-400">
          <p className="text-sm">By registering, you agree to the tournament terms and conditions</p>
        </div>
      </div>
    </div>
  )
}
