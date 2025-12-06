import React from 'react'
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

const content = [
  {
    title: "SQL Injection (SQLi) Attack",
    description:
      "SQL Injection is a technique where attackers manipulate backend database queries by injecting malicious SQL code through input fields. This can lead to unauthorized data access, modification, or even complete database compromise. Our system analyzes database query patterns and user inputs to detect signs of SQL injection attempts and prevents unauthorized query execution.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
        SQL Injection (SQLi) Attack
      </div>
    ),
  },
    {
    title: "Cross-Site Scripting (XSS)",
    description:
      "XSS is a web security vulnerability that allows attackers to inject malicious scripts into trusted websites. These scripts execute in the browser of a victim, enabling unauthorized actions like stealing cookies, session tokens, or manipulating webpage content. In our project, we implemented detection techniques that identify suspicious script injections in user inputs and block them before execution.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
        Cross-Site Scripting (XSS)
      </div>
    ),
  },
    {
    title: "Distributed Denial of Service (DDoS) Attack",
    description:
      "A DDoS attack involves overwhelming a server or network with massive amounts of traffic from multiple sources, causing service downtime. It disrupts availability and affects legitimate users. In our project, we monitor incoming traffic behavior, detect abnormal spikes, and classify possible DDoS patterns to ensure service stability.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
        Distributed Denial of Service (DDoS) Attack
      </div>
    ),
  },
  {
    title: "Brute Force Attack",
    description:
      "Brute force attacks involve repeatedly trying different passwords or keys until a correct one is found. Attackers use automated tools to perform rapid login attempts. Our system identifies brute force attempts by tracking repetitive failed login attempts from the same IP or user account and triggering protective mechanisms.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
          Brute Force Attack
      </div>
    ),
  },
  {
    title: "Scanning Attacks",
    description:
      "Scanning attacks occur when an attacker probes a system to discover open ports, active services, and potential vulnerabilities. This is often the initial phase before a larger attack. Our solution detects unusual scanning patterns such as rapid sequential port checks or repeated probing requests and flags them as potential reconnaissance attempts.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] text-white">
        Scanning Attacks
      </div>
    ),
  },
  {
    title: "Malicious IP Detection",
    description:
      "Malicious IP detection involves identifying IP addresses linked to suspicious, harmful, or abnormal activities. This includes spam, scanning, intrusion attempts, or known blacklisted IPs. In our project, we analyze traffic logs and correlate them with behavioral patterns to detect and block potentially malicious IP addresses in real time.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
        Malicious IP Detection
      </div>
    ),
  },
];

const FeaturesSection = () => {
  return (
    <div className="w-full py-4 bg-black">
      <h1 className='text-4xl text-center py-20 font-bold text-gray-900 dark:text-white'>Our Features</h1>
      <StickyScroll content={content} />
    </div>
  )
}

export default FeaturesSection