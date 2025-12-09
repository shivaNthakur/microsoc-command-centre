"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface AttackModalProps {
  isOpen: boolean;
  onClose: () => void;
  attack: {
    id: number;
    name: string;
    shortDesc: string;
    longDesc: string;
    route: string;
    photoUrl: string;
  } | null;
}

export default function AttackModal({ isOpen, onClose, attack }: AttackModalProps) {
  if (!attack) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto bg-gradient-to-b from-[#0b1220] to-black border border-blue-900/40 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-10 bg-black/50 rounded-full p-2 w-10 h-10 flex items-center justify-center"
              >
                ✕
              </button>

              {/* Attack Image */}
              <div className="relative w-full h-120 overflow-hidden rounded-t-2xl">
                <img
                  src={attack.photoUrl}
                  alt={attack.name}
                  className="w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/admin.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0b1220]" />
              </div>

              {/* Content */}
              <div className="p-8">
                
                {/* Attack Name */}
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-3">
                  {attack.name}
                </h2>

                {/* Short Description */}
                <p className="text-lg text-blue-300 font-semibold mb-4">
                  {attack.shortDesc}
                </p>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-blue-900/0 via-blue-900/40 to-blue-900/0 my-6" />

                {/* Long Description */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold text-gray-200">About This Attack</h3>
                  <p className="text-gray-300 leading-relaxed text-base">
                    {attack.longDesc}
                  </p>
                </div>

                {/* Key Info Boxes */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-blue-900/20 border border-blue-900/40 rounded-lg p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Threat Level</p>
                    <p className="text-xl font-bold text-red-400 mt-1">HIGH</p>
                  </div>
                  <div className="bg-purple-900/20 border border-purple-900/40 rounded-lg p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Detection Rate</p>
                    <p className="text-xl font-bold text-purple-400 mt-1">95%</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition duration-200 border border-gray-700"
                  >
                    Close
                  </button>

                  {/* View Details Button - Routes to Analytics Page */}
                  <Link
                    href={`/analyst/attacks/details?type=${encodeURIComponent(attack.name)}`}
                    className="flex-1"
                  >
                    <button
                      onClick={onClose}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-lg transition duration-200 transform hover:scale-105 active:scale-95"
                    >
                      View Details →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
