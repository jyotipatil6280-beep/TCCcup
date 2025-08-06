export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-900/95 to-teal-900/95 border-t border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-8 border-transparent">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src="https://i.ibb.co/jkVCpXPv/TCC-LOGO.png" alt="TCC Logo" className="h-8 w-8 object-contain" />
              <div className="text-white">
                <div className="font-bold">TCC</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              The ultimate BGMI tournament experience. Join the competition and showcase your skills.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <a href="/rules" className="block text-gray-300 hover:text-cyan-300 text-sm transition-colors">
                Tournament Rules
              </a>
              <a href="/format" className="block text-gray-300 hover:text-cyan-300 text-sm transition-colors">
                Format & Schedule
              </a>
              <a href="/stats" className="block text-gray-300 hover:text-cyan-300 text-sm transition-colors">
                Live Statistics
              </a>
              <a href="/teams" className="block text-gray-300 hover:text-cyan-300 text-sm transition-colors">
                Registered Teams
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Contact</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>For support and inquiries:</p>
              <p>X: @UNIVERSALGC1</p>
              <p>Organizer: @PravAwym ; @Ncnlkncp</p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center border-transparent">
          <p className="text-gray-400 text-sm">© 2025 UGC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
