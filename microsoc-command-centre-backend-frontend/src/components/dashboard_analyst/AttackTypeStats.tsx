"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";

interface AttackTypeData {
  type: string;
  count: number;
  severity: "critical" | "high" | "medium" | "low" | "info";
  lastSeen: string;
}

interface AttackTypeStatsProps {
  onSelectAttack: (attackType: string) => void;
}

const COLORS = {
  critical: "#ff1744",
  high: "#ff9100",
  medium: "#ffd600",
  low: "#00e676",
  info: "#00b0ff",
};

export default function AttackTypeStats({ onSelectAttack }: AttackTypeStatsProps) {
  const [attackStats, setAttackStats] = useState<AttackTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttack, setSelectedAttack] = useState<string | null>(null);

  // Fetch attack type statistics
  useEffect(() => {
    async function fetchAttackStats() {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:8000/attack-types");
        if (!res.ok) throw new Error("Failed to fetch attack stats");
        
        const data: AttackTypeData[] = await res.json();
        setAttackStats(data);
      } catch (error) {
        console.error("Error fetching attack stats:", error);
        // Fallback dummy data for demonstration
        setAttackStats([
          { type: "SQL Injection", count: 45, severity: "high", lastSeen: new Date().toISOString() },
          { type: "XSS", count: 32, severity: "medium", lastSeen: new Date().toISOString() },
          { type: "Brute Force", count: 28, severity: "critical", lastSeen: new Date().toISOString() },
          { type: "DDoS", count: 15, severity: "critical", lastSeen: new Date().toISOString() },
          { type: "Directory Scan", count: 22, severity: "low", lastSeen: new Date().toISOString() },
          { type: "Bot Traffic", count: 18, severity: "info", lastSeen: new Date().toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchAttackStats();

    // Set up real-time updates via WebSocket
    const wsUrl = "ws://127.0.0.1:8000/ws/attack-stats";
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg.event === "attack_type_update" && msg.data) {
          setAttackStats((prev) => {
            const updated = [...prev];
            const idx = updated.findIndex((a) => a.type === msg.data.type);
            if (idx >= 0) {
              updated[idx] = {
                ...updated[idx],
                count: msg.data.count,
                lastSeen: msg.data.lastSeen || new Date().toISOString(),
              };
            } else {
              updated.push(msg.data);
            }
            return updated.sort((a, b) => b.count - a.count);
          });
        }
      } catch (err) {
        console.warn("WS message error:", err);
      }
    };

    ws.onerror = (err) => {
      console.warn("WS error:", err);
    };

    return () => {
      try { ws.close(); } catch {}
    };
  }, []);

  const handleAttackClick = (attackType: string) => {
    setSelectedAttack(attackType);
    onSelectAttack(attackType);
  };

  if (loading) {
    return (
      <div className="p-6 bg-[#0b1220] rounded-2xl border border-blue-900/40 shadow-lg">
        <p className="text-gray-400 text-center">Loading attack statistics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bar Chart - Attack Type Counts */}
      <motion.div
        className="p-6 bg-[#0b1220] rounded-2xl border border-blue-900/40 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold text-blue-400 mb-4">Attack Types Overview</h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={attackStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
            <XAxis dataKey="type" stroke="#888" angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#888" />
            <Tooltip 
              contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e3a5f", borderRadius: "8px", color: "#fff" }}
              cursor={{ fill: "rgba(0, 150, 255, 0.1)" }}
            />
            <Bar dataKey="count" fill="#00d4ff" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Pie Chart - Severity Distribution */}
      <motion.div
        className="p-6 bg-[#0b1220] rounded-2xl border border-purple-900/40 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-xl font-bold text-purple-400 mb-4">Severity Distribution</h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={attackStats}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ type, count }) => `${type}: ${count}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {attackStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.severity]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e3a5f", borderRadius: "8px", color: "#fff" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Attack Type List - Clickable Cards */}
      <motion.div
        className="p-6 bg-[#0b1220] rounded-2xl border border-green-900/40 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-xl font-bold text-green-400 mb-4">Attack Types (Click for Details)</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {attackStats.map((attack) => (
            <motion.div
              key={attack.type}
              onClick={() => handleAttackClick(attack.type)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedAttack === attack.type
                  ? "bg-blue-900/30 border-2 border-blue-400"
                  : "bg-black/30 border border-gray-700 hover:border-blue-500"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-white">{attack.type}</h4>
                  <p className="text-2xl font-bold text-blue-400 mt-2">{attack.count}</p>
                </div>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[attack.severity] }}
                />
              </div>
              
              <p className="text-xs text-gray-400 mt-3">
                Last Seen: {new Date(attack.lastSeen).toLocaleString()}
              </p>
              
              <div className="mt-3 text-xs">
                <span
                  className="px-2 py-1 rounded-full font-semibold"
                  style={{
                    backgroundColor: COLORS[attack.severity] + "33",
                    color: COLORS[attack.severity],
                  }}
                >
                  {attack.severity.toUpperCase()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
