"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full h-20 text-white flex items-center justify-between px-8 shadow-lg fixed z-10">
      {/* LEFT LOGO */}
      <div className="flex items-center gap-3">
        <img src="/logo.jpg" alt="logo" className="w-10 h-10" />
        <h1 className="text-2xl font-bold tracking-wide">MICROSOC</h1>
      </div>

      {/* CENTER LINKS */}
      <div className="flex items-center gap-10 text-lg font-medium">
        {pathname === "/" ? (
          <>
            <a href="/" className="hover:text-blue-600 transition">Home</a>
            <a href="#about" className="hover:text-blue-600 transition">About</a>
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
          </>
        ) : (
          <>
            <Link href="/#home" className="hover:text-blue-600 transition">Home</Link>
            <Link href="/#about" className="hover:text-blue-600 transition">About</Link>
            <Link href="/#features" className="hover:text-blue-600 transition">Features</Link>
          </>
        )}
      </div>

      {/* RIGHT BUTTONS */}
      <div className="flex items-center gap-6 relative">
        
        {/* SIGN IN DROPDOWN */}
        <div className="relative group">
          <button className="px-5 py-2 bg-gray-700 rounded-xl hover:bg-gray-800 transition font-semibold">
            Sign In
          </button>

          <div
            className="absolute right-0 mt-2 bg-gray-600 text-white rounded-lg shadow-lg w-32 p-2 opacity-0 invisible 
                       group-hover:opacity-100 group-hover:visible transition-all duration-200"
          >
            <Link
              href="/signup?role=analyst"
              className="block px-2 py-1 hover:bg-gray-500 rounded"
            >
              Analyst
            </Link>
          </div>
        </div>

        {/* LOGIN DROPDOWN */}
        <div className="relative group">
          <button className="px-5 py-2 bg-gray-900 rounded-xl hover:bg-gray-700 transition font-semibold">
            Login
          </button>

          <div
            className="absolute right-0 mt-2 bg-gray-600 text-white rounded-lg shadow-lg w-32 p-2 opacity-0 invisible 
                       group-hover:opacity-100 group-hover:visible transition-all duration-200"
          >
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
        </div>

      </div>
    </nav>
  );
}