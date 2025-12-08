"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import Next.js Image component for optimization

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
  const [expanded, setExpanded] = useState<number | null>(null);
  const router = useRouter();

  // Helper function to find the expanded attack details
  const expandedAttack = attacks.find((a) => a.id === expanded);

  return (
    <div className="relative w-full mt-12">
      
      {/* GRID 2x5 RESPONSIVE (NO CHANGE HERE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {attacks.map((atk) => (
          <motion.div
            key={atk.id}
            layoutId={`attack-${atk.id}`}
            onMouseEnter={() => setExpanded(atk.id)}
            className="p-5 bg-[#0b1220] border border-blue-900/40 
                        rounded-xl cursor-pointer hover:scale-105 transition shadow-lg"
          >
            <h2 className="text-xl font-semibold text-blue-300">{atk.name}</h2>
            <p className="text-gray-400 mt-2">{atk.shortDesc}</p>
          </motion.div>
        ))}
      </div>

      {/* FULLSCREEN OVERLAY WITH CENTERED CARD */}
      <AnimatePresence>
        {expanded !== null && expandedAttack && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 
                        flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* EXPANDED CARD */}
            <motion.div
              layoutId={`attack-${expanded}`}
              onMouseLeave={() => setExpanded(null)}   
              className="bg-[#0b1220] border border-blue-900/40 rounded-2xl 
                          shadow-2xl text-center max-w-xl w-80 overflow-hidden"
            >
              
              {/* 3. REPLACE H2 WITH IMAGE */}
              <div className="flex mb-2 w-80 h-36 overflow-hidden rounded-t-xl">
                <img
                  src={expandedAttack.photoUrl} // Use the new photoUrl
                  alt={expandedAttack.name}     // Use the attack name as alt text
                
                  className="rounded-lg object-cover h-full w-80"
                />
              </div>
                           
              <p className="text-gray-300 leading-relaxed mb-2 w-[30%] p-10">
                {expandedAttack.longDesc}
              </p>

              <button
                onClick={() => router.push(expandedAttack.route)}
                className="px-3 py-3 bg-blue-600 hover:bg-blue-700 
                            rounded-xl text-white text-lg p-10 mb-5"
              > 
                 View Details →
              </button> 
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}