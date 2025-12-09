"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  Home,
  Users,
  Settings,
  Bell,
  HelpCircle,
} from "lucide-react";

// Menu list
const menu = [
  { name: "Dashboard", icon: <Home size={20} />, route: "/admin/dashboard" },
  { name: "Analysts", icon: <Users size={20} />, route: "/analyst/Analysts" },
  { name: "Settings", icon: <Settings size={20} />, route: "settings" },
  { name: "Notifications", icon: <Bell size={20} />, route: "/admin/notifications" },
  { name: "Help", icon: <HelpCircle size={20} />, route: "/#contact" },
];

export default function Sidebar() {
  const router = useRouter();
  const [themeModal, setThemeModal] = useState(false);
  const [theme, setTheme] = useState(null); // "dark" | "light" | "system" | null (loading)

  // --- Theme Logic Functions ---

  // Apply theme safely by manipulating the documentElement classes
  const applyTheme = (t) => {
    if (!t || t === "system") {
      // Determine actual system preference if "system" is passed
      const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      t = prefersDark ? "dark" : "light";
    }

    const html = document.documentElement;

    // Remove both then add the desired (keeps things deterministic)
    html.classList.remove("light", "dark");
    
    // Apply the resolved theme class
    if (t === "dark") {
      html.classList.add("dark");
    } else if (t === "light") {
      html.classList.add("light");
    }

    // optional: update meta theme-color for mobile browsers
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", t === "dark" ? "#020617" : "#ffffff");
    }
  };

  // Load saved theme on mount (synchronous to avoid flicker)
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Use saved theme, or determine initial theme (if saved theme is null/system)
    const initial = saved || (prefersDark ? "dark" : "light");
    
    // Set theme state, preserving "system" if that's what was saved
    setTheme(saved === "system" ? "system" : initial);
    
    // Apply the determined theme immediately
    applyTheme(initial);

    // Watch for system theme changes if set to "system"
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e) => {
      if (localStorage.getItem("theme") === "system") {
        applyTheme(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener('change', handleSystemChange);

    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);


  // Toggle theme (switch) - only toggles between dark/light
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  // Set explicit theme (button)
  const setExplicitTheme = (t) => {
    setTheme(t);
    localStorage.setItem("theme", t);
    applyTheme(t);
    setThemeModal(false);
  };
  
  // Set theme to System preference
  const setSystemTheme = () => {
    // Clear localStorage item to revert to system preference logic
    localStorage.removeItem("theme");
    setTheme("system");
    
    // Re-apply the theme based on the current system setting
    const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
    setThemeModal(false);
  };

  // --- Menu Handling ---

  // Handle menu click
  const handleClick = (item) => {
    if (item.route === "settings") {
      setThemeModal(true);
      return;
    }

    if (item.route.startsWith("/#")) {
  window.location.href = item.route;  // Direct jump to landing page footer
  return;
}


    router.push(item.route);
  };

  return (
    <>
      {/* SIDEBAR */}
      <div className="w-64 h-screen fixed bg-gradient-to-b from-[#0a1e3f] to-[#020617] 
      border-r border-blue-900 shadow-2xl text-gray-300 p-5 hidden md:block">

        <h1 className="text-2xl font-extrabold tracking-wide text-blue-400 mb-8">
          SOC Admin
        </h1>

        <div className="flex flex-col space-y-2">
          {menu.map((m, i) => (
            <button
              key={i}
              onClick={() => handleClick(m)}
              className="flex items-center space-x-4 px-4 py-3 rounded-lg
                hover:bg-blue-900/30 hover:text-white transition-all
                border border-transparent hover:border-blue-700 text-left"
            >
              <div className="text-blue-400">{m.icon}</div>
              <span className="font-medium">{m.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* THEME MODAL */}
      {themeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-[#0b1220] p-6 rounded-xl border border-blue-800 shadow-xl w-[360px] text-center transition-colors">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-blue-400 mb-4">
              Choose Theme
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Select a theme for the dashboard. Your choice will be saved.
            </p>

            <div className="flex gap-3">
              {/* Dark Button */}
              <button
                onClick={() => setExplicitTheme("dark")}
                className={`flex-1 py-2 rounded-lg border ${
                  theme === "dark" ? "bg-blue-600 text-white border-blue-600" : "bg-transparent text-slate-800 dark:text-slate-200 border-gray-300 dark:border-gray-700"
                }`}
              >
                Dark
              </button>

              {/* Light Button */}
              <button
                onClick={() => setExplicitTheme("light")}
                className={`flex-1 py-2 rounded-lg border ${
                  theme === "light" ? "bg-blue-600 text-white border-blue-600" : "bg-transparent text-slate-800 dark:text-slate-200 border-gray-300 dark:border-gray-700"
                }`}
              >
                Light
              </button>
            </div>
            
            {/* System Button */}
            <div className="mt-3">
              <button
                onClick={setSystemTheme}
                className={`w-full py-2 rounded-lg border ${
                  theme === "system" ? "bg-blue-600 text-white border-blue-600" : "bg-transparent text-slate-800 dark:text-slate-200 border-gray-300 dark:border-gray-700"
                }`}
              >
                System Preference
              </button>
            </div>


            <div className="mt-4">
              <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-slate-800 dark:text-white"
              >
                Toggle (Quick)
              </button>
            </div>

            <button
              onClick={() => setThemeModal(false)}
              className="w-full mt-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}