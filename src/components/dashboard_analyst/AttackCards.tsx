"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AttackModal from "./AttackModal";

// 1. UPDATE INTERFACE to include photoUrl
interface Attack {
  id: number;
  name: string;
  shortDesc: string;
  longDesc: string;
  route: string;
  photoUrl: string; // <-- New property for the image path
}

// 2. UPDATE ATTACKS ARRAY with a placeholder photoUrl for each attack
const attacks: Attack[] = [
  { id: 1, name: "Bot Traffic", shortDesc: "Automated scripts generating abnormal requests.", longDesc: "Automated scripts or bots sending repeated requests to your server, generating fake or abnormal traffic patterns.", route: "/analyst/attacks/Bottraffic", photoUrl: "/attack_images/bot_traffic.jpg" },
  { id: 2, name: "Brute Force", shortDesc: "Repeated login attempts guessing passwords.", longDesc: "An attacker tries many username–password combinations repeatedly until one works.", route: "/analyst/attacks/Bruteforce", photoUrl: "/attack_images/brute_force.jpg" },
  { id: 3, name: "Dirscan", shortDesc: "Scanning server directories for exposure.", longDesc: "A scan that checks for hidden or unlisted directories and files on a server (e.g., /admin, /backup, /login_old).", route: "/analyst/attacks/Dir", photoUrl: "/attack_images/dir_scan.jpg" },
  { id: 4, name: "DOS(Denial of Service)", shortDesc: "Traffic overload crashing the server.", longDesc: "Overloading a server with too many requests so it becomes slow or completely unavailable.", route: "/analyst/attacks/Dos", photoUrl: "/attack_images/dos.jpg" },
  { id: 5, name: "Gobuster Scan", shortDesc: "Fast directory brute-force discovery.", longDesc: "A fast directory and file brute-forcer used to discover folders, files, and virtual hosts on a web server.", route: "/analyst/attacks/Gobuster", photoUrl: "/attack_images/gobuster.jpg" },
  { id: 6, name: "Nmap Scan", shortDesc: "Port scanning to detect services.", longDesc: "A network scanner that detects open ports, running services, and operating system details.", route: "/analyst/attacks/Nmap", photoUrl: "/attack_images/nmap.jpg" },
  { id: 7, name: "XSS(Cross-Site Scripting)", shortDesc: "Injecting scripts into user browsers.", longDesc: "Injecting malicious JavaScript into web pages so it runs in the victim’s browser.", route: "/analyst/attacks/Xss", photoUrl: "/attack_images/xss.jpg" },
  { id: 8, name: "SQLI(SQL Injection)", shortDesc: "Injecting SQL to access data.", longDesc: "Injecting malicious SQL code into input fields to manipulate or extract data from the database.", route: "/analyst/attacks/Sqli", photoUrl: "/attack_images/sqli.jpg" },
  { id: 9, name: "Sensitive Paths", shortDesc: "Searching for exposed critical files.", longDesc: "Scanning for locations like /admin, /config, /backup.zip that may expose sensitive data if publicly accessible", route: "/analyst/attacks/Sensitive", photoUrl: "/attack_images/sensitive.jpg" },
  { id: 10, name: "Nikto Scan", shortDesc: "Scans servers for dangerous vulnerabilities.", longDesc: "A vulnerability scanner that checks web servers for outdated versions, misconfigurations, and common security issues.Injects harmful code into systems.", route: "/analyst/attacks/Nikto", photoUrl: "/attack_images/nikto.jpg" }
];

export default function AttackCards() {
  const [selectedAttack, setSelectedAttack] = useState<Attack | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (attack: Attack) => {
    setSelectedAttack(attack);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedAttack(null), 300);
  };

  return (
    <>
      {/* Attack Cards Grid */}
      <div className="relative w-full mt-12">
        <h2 className="text-2xl font-bold text-blue-400 mb-6">Attack Types</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {attacks.map((atk) => (
            <motion.div
              key={atk.id}
              onClick={() => handleCardClick(atk)}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="p-5 bg-gradient-to-br from-[#0b1220] to-black border border-blue-900/40 
                          rounded-xl cursor-pointer shadow-lg hover:border-blue-700/60 transition"
            >
              <h3 className="text-lg font-semibold text-blue-300 mb-2">{atk.name}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{atk.shortDesc}</p>
              
              {/* Click Indicator */}
              <div className="mt-4 text-xs text-gray-500">
                Click to learn more →
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Attack Modal */}
      <AttackModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        attack={selectedAttack}
      />
    </>
  );
}