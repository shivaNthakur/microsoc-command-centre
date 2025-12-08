"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useRouter } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
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

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showApprovalModal, setShowApprovalModal] = useState(false);

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
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "analyst",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Signup failed");
        setIsLoading(false);
        return;
      }
      // Show approval modal instead of redirecting immediately
      setShowApprovalModal(true);
      
      // Clear form
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMsg("Something went wrong during signup. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <AuroraBackground>
      <div className="min-h-screen flex">
        {/* Approval Modal */}
        {showApprovalModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[#0b1020] p-8 rounded-2xl max-w-md w-full mx-4
                shadow-[0_0_40px_#1e3a8a] border border-blue-600"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-blue-600 border-t-blue-400"
              />
              <h2 className="text-2xl font-bold text-center text-blue-400 mb-4">
                Awaiting Admin Approval
              </h2>
              <p className="text-center text-slate-300 mb-4">
                Your account has been created successfully! An admin will review your request shortly.
              </p>
              <p className="text-center text-sm text-slate-400 mb-6">
                You'll receive an email once your account is approved. You can then log in with your credentials.
              </p>
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  router.push("/login?role=analyst");
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold
                  shadow-[0_0_15px_#2563eb] transition-all"
              >
                Go to Login
              </button>
            </motion.div>
          </div>
        )}

        {/* Left side image */}
        <div className="w-1/2 items-center justify-end hidden md:flex pr-40 relative z-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, x: -50 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative w-[50rem] h-[60rem]"
          >
            <div
              className="absolute left-20 top-1/2 -translate-y-1/2 
              w-[350px] h-[400px] bg-blue-500/30 blur-[120px] rounded-full"
            />
            <Image
              src="/power-ranger3.png"
              alt="Power Ranger"
              fill
              className="object-contain"
            />
          </motion.div>
        </div>

        {/* Right side form */}
        <div className="w-full md:w-1/2 flex items-center justify-start pl-8 relative">
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleHoverEnd}
            onHoverStart={handleHoverStart}
            style={{ transformStyle: "preserve-3d", transformOrigin: "top" }}
            animate={{
              rotateX,
              rotateY,
              scale: hoverScale,
              x: 0,
              opacity: 1,
            }}
            initial={{ x: 200, opacity: 0, scale: 0.9 }}
            transition={{
              rotateX: { type: "spring", stiffness: 150, damping: 15 },
              rotateY: { type: "spring", stiffness: 150, damping: 15 },
              scale: { type: "spring", stiffness: 200, damping: 18 },
              x: { duration: 1.5, ease: "easeOut" },
              opacity: { duration: 1.5 },
            }}
            className="bg-[#0b1020] p-10 rounded-2xl w-full max-w-md 
              shadow-[0_0_30px_#1e3a8a] relative z-10"
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="text-3xl font-semibold text-center mb-8
                text-blue-400 drop-shadow-[0_0_10px_#3b82f6]"
            >
              Analyst Sign Up
            </motion.h2>

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

              {/* Success message */}
              {successMsg && (
                <motion.div
                  variants={itemVariants}
                  className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500 text-green-400 text-sm"
                >
                  {successMsg}
                </motion.div>
              )}
              {/* Full Name */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium mb-1 text-blue-300">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full mb-5 px-4 py-2 rounded-lg bg-[#111827] text-white
                    border border-blue-600 focus:border-blue-400
                    shadow-[0_0_10px_#1e40af] focus:shadow-[0_0_15px_#3b82f6]
                    outline-none transition-all"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </motion.div>

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
                  placeholder="Create a password"
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
                {isLoading ? "Creating Account..." : "Create Account"}
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </AuroraBackground>
  );
}