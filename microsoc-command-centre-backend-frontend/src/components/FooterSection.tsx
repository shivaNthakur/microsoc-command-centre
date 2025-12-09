"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <>
      {/* CONTACT SECTION */}
      <footer className="text-white py-12 px-6 mt-12 bg-black">
        <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-3">

          {/* Contact Details */}
          <div id="contact">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-300">Email: blueranger@socsystem.com</p>
            <p className="text-gray-300">Phone: +91 98765 43210</p>
            <p className="text-gray-300">Red Ranger Command Base, Sector-7</p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2 text-gray-300">

              <li
                className="hover:text-blue-700 cursor-pointer"
                onClick={() => router.push("/")}
              >
                Home
              </li>

              <li
                className="hover:text-blue-700 cursor-pointer"
                onClick={() => router.push("/admin/dashboard")}
              >
                Admin Dashboard
              </li>

              <li
                className="hover:text-blue-700 cursor-pointer"
                onClick={() => router.push("/analyst/dashboard")}
              >
                Analyst Dashboard
              </li>

            </ul>
          </div>

          {/* Social Icons */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Follow Us</h2>
            <div className="flex gap-4 text-3xl">
              <i className="ri-instagram-line cursor-pointer hover:text-pink-400"></i>
              <i className="ri-github-line cursor-pointer hover:text-gray-300"></i>
              <i className="ri-linkedin-fill cursor-pointer hover:text-blue-400"></i>
            </div>
          </div>

        </div>

        <div className="text-center text-sm text-gray-500 mt-12">
          © 2025 Red Ranger SOC. All Rights Reserved.
        </div>
      </footer>
    </>
  );
}
