import { Trophy, ExternalLink, MessageCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white/5 backdrop-blur-md border-t border-white/10 mt-auto shadow-2xl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src="https://i.ibb.co/jkVCpXPv/TCC-LOGO.png"
                  alt="TCC Logo"
                  className="h-12 w-12 object-contain drop-shadow-lg"
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 to-teal-400/20 rounded-full blur-lg"></div>
              </div>
              <div className="text-white">
                <div className="text-2xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-teal-300 bg-clip-text text-transparent">
                  TCC
                </div>
                <div className="text-sm text-gray-400 font-medium">Tournament Platform</div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Experience the ultimate BGMI tournament with cutting-edge gameplay, professional streaming, and incredible
              prizes. Join the elite competition.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium text-sm">Tournament Active</span>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-400" />
              Quick Access
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { name: "Tournament Rules", href: "/rules" },
                { name: "Format & Schedule", href: "/format" },
                { name: "Live Statistics", href: "/stats" },
                { name: "Registered Teams", href: "/teams" },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="group flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 hover:border-blue-400/30 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="text-gray-300 group-hover:text-white font-medium transition-colors">
                    {link.name}
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              Connect With Us
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <p className="text-gray-300 font-medium mb-3">Tournament Support</p>
                <div className="space-y-2">
                  <a
                    href="https://twitter.com/UNIVERSALGC1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    @UNIVERSALGC1
                  </a>
                </div>
              </div>

              <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <p className="text-gray-300 font-medium mb-3">Tournament Organizers</p>
                <div className="space-y-2">
                  <a
                    href="https://twitter.com/PravAwym"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    @PravAwym
                  </a>
                  <a
                    href="https://twitter.com/Ncnlkncp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    @Ncnlkncp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 font-medium">
              © 2025{" "}
              <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent font-bold">
                UGC Tournament Platform
              </span>
              . All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Powered by Horizon UI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
