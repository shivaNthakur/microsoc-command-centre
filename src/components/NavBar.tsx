"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [showLoginRoles, setShowLoginRoles] = useState(false);
  const [showSigninRole, setShowSigninRole] = useState(false);

  return (
    <nav className="w-full h-20 text-white flex items-center justify-between px-8 shadow-lg fixed z-10">
      <div className="flex items-center gap-3">
        <img src="/logo.jpg" alt="logo" className="w-10 h-10" />
        <h1 className="text-2xl font-bold tracking-wide">MICROSOC</h1>
      </div>

      {/* CENTER LINKS */}
      <div className="flex items-center gap-10 text-lg font-medium">

        {/* If already on landing page → use section hash scroll */}
        {pathname === "/" ? (
          <>
            <a href="/" className="hover:text-blue-600 transition">
              Home
            </a>

            <a href="#about" className="hover:text-blue-600 transition">
              About
            </a>

            <a href="#features" className="hover:text-blue-600 transition">
              Features
            </a>
          </>
        ) : (
          /* If on another page → go to landing page with section hash */
          <>
            <Link href="/#home" className="hover:text-blue-600 transition">
              Home
            </Link>

            <Link href="/#about" className="hover:text-blue-600 transition">
              About
            </Link>

            <Link href="/#features" className="hover:text-blue-600 transition">
              Features
            </Link>
          </>
        )}
      </div>

      {/* RIGHT SIDE BUTTONS */}
      <div className="flex items-center gap-6 relative">
        
        {/* SIGN IN */}
        <div
          className="relative"
          onMouseEnter={() => setShowSigninRole(true)}
          onMouseLeave={() => setShowSigninRole(false)}
        >
          <button className="px-5 py-2 bg-gray-700 rounded-xl hover:bg-gray-800 transition font-semibold">
            Sign In
          </button>

          {showSigninRole && (
            <div className="absolute right-0 mt-2 bg-gray-600 text-white rounded-lg shadow-lg w-32 p-2">
              <Link
                href="/signup?role=analyst"
                className="block px-2 py-1 hover:bg-gray-500 rounded"
              >
                Analyst
              </Link>
            </div>
          )}
        </div>

        {/* LOGIN */}
        <div
          className="relative"
          onMouseEnter={() => setShowLoginRoles(true)}
          onMouseLeave={() => setShowLoginRoles(false)}
        >
          <button className="px-5 py-2 bg-gray-900 rounded-xl hover:bg-gray-700 transition font-semibold">
            Login
          </button>

          {showLoginRoles && (
            <div className="absolute right-0 mt-2 bg-gray-600 text-white rounded-lg shadow-lg w-32 p-2">
              <Link
                href="/login?role=admin"
                className="block px-2 py-1 hover:bg-gray-500 rounded"
              >
                Admin
              </Link>

              <Link
                href="/login?role=analyst"
                className="block px-2 py-1 hover:bg-gray-500 rounded"
              >
                Analyst
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
