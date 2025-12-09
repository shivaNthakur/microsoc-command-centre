"use client";

import { Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Topbar() {
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/admin/pending-requests", { cache: "no-store" });
        const data = await res.json();
        setHasNotification(data.requests && data.requests.length > 0);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="w-full flex justify-between items-center px-6 py-4 bg-gradient-to-b from-[#0a1e3f] to-[#020617] border-b border-[#0a1e4f]">

      {/* Left Section */}
      <h1 className="text-2xl font-semibold text-white tracking-wide">
        Ranger Command Console
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Notification Icon → Redirect to Notifications Page */}
        <Link href="/admin/notifications">
          <div className="relative cursor-pointer hover:opacity-80 transition">
            <Bell className="text-white w-6 h-6" />

            {/* Red Dot */}
            {hasNotification && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </div>
        </Link>

        {/* Language */}
        <span className="text-white text-lg cursor-pointer hover:opacity-80 transition">
          🇮🇳
        </span>

        {/* Profile */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
          <img
            src="/admin.jpg"
            alt="Admin Image"
            className="w-[35px] h-[35px] rounded-full"
          />
          <span className="text-gray-200 text-sm">Admin</span>
        </div>

      </div>
    </div>
  );
}
