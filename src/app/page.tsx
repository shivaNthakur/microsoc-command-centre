'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                MicroSOC Command Center
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Red Ranger's
            </span>
            <br />
            <span className="text-white">MicroSOC Command Center</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Advanced cyber-defense shield capable of capturing attack logs, identifying threats,
            creating incidents in real-time, and visualizing evolving threats across the Morphin Grid.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/sign-up"
              className="px-8 py-3 border border-zinc-700 hover:border-zinc-600 rounded-lg font-semibold transition-colors"
            >
              Become an Analyst
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-semibold mb-2">Real-time Monitoring</h3>
            <p className="text-gray-400">
              Monitor attacks in real-time with live log streaming and instant threat detection.
            </p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold mb-2">Geo-location Tracking</h3>
            <p className="text-gray-400">
              Visualize attack origins on a world map with detailed geographic information.
            </p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
            <p className="text-gray-400">
              Comprehensive dashboards with charts, statistics, and threat intelligence.
            </p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Instant Alerts</h3>
            <p className="text-gray-400">
              Get notified immediately when critical threats are detected.
            </p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Incident Management</h3>
            <p className="text-gray-400">
              Create, assign, and track security incidents through their lifecycle.
            </p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
            <p className="text-gray-400">
              Assign incidents to analysts and track their progress in real-time.
            </p>
          </div>
        </div>

        {/* Attack Types */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-8">Supported Attack Types</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              'Bot Traffic',
              'Brute Force',
              'Directory Scan',
              'DoS',
              'Gobuster Scan',
              'Nikto Scan',
              'Nmap Scan',
              'Sensitive Paths',
              'SQL Injection',
              'XSS',
            ].map((type) => (
              <div
                key={type}
                className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center"
              >
                <span className="text-sm font-medium">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>© 2024 MicroSOC Command Center. Protecting the Morphin Grid.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
