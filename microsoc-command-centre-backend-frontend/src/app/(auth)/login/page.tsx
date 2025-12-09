"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useSearchParams, useRouter } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.2, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 10 },
  },
};

const buttonVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 10 },
  },
};

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 🔥 Extract role from URL: /login?role=admin
  const loginAs = searchParams.get("role") || "analyst";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [hoverScale, setHoverScale] = useState(1);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateAmount = 25;

    setRotateY(((x / rect.width) - 0.5) * rotateAmount * 2);
    setRotateX(-((y / rect.height) - 0.5) * rotateAmount * 2);
  };

  const handleHoverStart = () => setHoverScale(1.06);
  const handleHoverEnd = () => {
    setHoverScale(1);
    setRotateX(0);
    setRotateY(0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      // Use NextAuth's signIn function with credentials provider
      const result = await signIn("credentials", {
        email,
        password,
        loginAs,
        redirect: false, // Don't auto-redirect, we'll handle it manually
      });

      if (!result?.ok) {
        setErrorMsg(result?.error || "Login failed");
        setIsLoading(false);
        return;
      }

      // Login successful, redirect based on role
      setTimeout(() => {
        if (loginAs === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/analyst/dashboard");
        }
      }, 100);
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <AuroraBackground>
      <div className="min-h-screen flex">

        {/* Left Section - Image */}
        <div className="w-1/2 items-center justify-end hidden md:flex pr-40 relative z-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, x: -50 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative w-[50rem] h-[60rem]"
          >
            <div className="absolute left-20 top-1/2 -translate-y-1/2
              w-[350px] h-[400px] bg-blue-500/30 blur-[120px] rounded-full"></div>

            <Image
              src="/power-ranger3.png"
              alt="Power Ranger"
              fill
              className="object-contain"
            />
          </motion.div>
        </div>

        {/* Right Section - Login Card */}
        <div className="w-full md:w-1/2 flex items-center justify-start pl-8 relative">

          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleHoverEnd}
            onHoverStart={handleHoverStart}
            style={{ transformStyle: "preserve-3d", transformOrigin: "top" }}
            animate={{ rotateX, rotateY, scale: hoverScale, x: 0, opacity: 1 }}
            initial={{ x: 200, opacity: 0, scale: 0.9 }}
            transition={{
              rotateX: { type: "spring", stiffness: 150, damping: 15 },
              rotateY: { type: "spring", stiffness: 150, damping: 15 },
              scale: { type: "spring", stiffness: 200, damping: 18 },
              x: { duration: 1.5, ease: "easeOut" },
              opacity: { duration: 1.5 },
            }}
            className="bg-[#0b1020] p-10 rounded-2xl w-full max-w-md shadow-[0_0_30px_#1e3a8a] relative z-10"
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="text-3xl font-semibold text-center mb-8 
                text-blue-400 drop-shadow-[0_0_10px_#3b82f6]"
            >
              {loginAs === "admin" ? "Admin Login" : "Analyst Login"}
            </motion.h2>

            {/* FORM */}
            <motion.form
              onSubmit={handleSubmit}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Error message */}
              {errorMsg && (
                <motion.div
                  variants={itemVariants}
                  className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-400 text-sm"
                >
                  {errorMsg}
                </motion.div>
              )}
              {/* Email */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium mb-1 text-blue-300">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full mb-5 px-4 py-2 rounded-lg bg-[#111827] text-white
                    border border-blue-600 focus:border-blue-400
                    shadow-[0_0_10px_#1e40af] focus:shadow-[0_0_15px_#3b82f6]
                    outline-none transition-all"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium mb-1 text-blue-300">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full mb-6 px-4 py-2 rounded-lg bg-[#111827] text-white
                    border border-blue-600 focus:border-blue-400
                    shadow-[0_0_10px_#1e40af] focus:shadow-[0_0_15px_#3b82f6]
                    outline-none transition-all"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </motion.div>

              {/* Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                variants={buttonVariants}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white 
                  py-2 rounded-lg font-semibold tracking-wider 
                  shadow-[0_0_15px_#2563eb] hover:shadow-[0_0_20px_#3b82f6]
                  transition"
              >
                {isLoading ? "Logging in..." : "Login"}
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </AuroraBackground>
  );
}