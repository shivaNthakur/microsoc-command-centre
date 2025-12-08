"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import Link from "next/link";

interface AttackDetail {
  timestamp: string;
  ip: string;
  severity: string;
  payload?: string;
  method?: string;
  target?: string;
}

interface AttackStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  lastUpdate: string;
}

const SEVERITY_COLORS = {
  critical: "#ff1744",
  high: "#ff9100",
  medium: "#ffd600",
  low: "#00e676",
  info: "#00b0ff",
};

export default function AttackDetailsPage() {
  const searchParams = useSearchParams();
  const attackType = searchParams.get("type") || "Unknown";
  
  const [attackDetails, setAttackDetails] = useState<AttackDetail[]>([]);
  const [stats, setStats] = useState<AttackStats>({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    lastUpdate: new Date().toISOString(),
  });
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Fetch initial attack details
    async function fetchDetails() {
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/attack-details?type=${encodeURIComponent(attackType)}`);
        if (!res.ok) throw new Error("Failed to fetch attack details");
        
        const data = await res.json();
        setAttackDetails(data.incidents || []);
        setStats(data.stats || {
          total: data.incidents?.length || 0,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
          lastUpdate: new Date().toISOString(),
        });
        
        // Build time series data
        const grouped = groupByTimeInterval(data.incidents || []);
        setTimeSeriesData(grouped);
      } catch (error) {
        console.error("Error fetching attack details:", error);
        setAttackDetails([
          {
            timestamp: new Date().toISOString(),
            ip: "192.168.1.100",
            severity: "high",
            payload: "SELECT * FROM users",
            method: "POST",
            target: "/api/login",
          },
          {
            timestamp: new Date(Date.now() - 60000).toISOString(),
            ip: "10.0.0.50",
            severity: "critical",
            payload: "<script>alert('XSS')</script>",
            method: "GET",
            target: "/search",
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();

    // WebSocket connection for real-time updates
    const wsUrl = `ws://127.0.0.1:8000/ws/attack-details?type=${encodeURIComponent(attackType)}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS connected to attack details");
    };

    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg.event === "new_attack_detail" && msg.data) {
          const newIncident = msg.data as AttackDetail;
          
          setAttackDetails((prev) => [newIncident, ...prev].slice(0, 100)); // Keep last 100
          
          setStats((prev) => ({
            ...prev,
            total: prev.total + 1,
            [newIncident.severity]: (prev[newIncident.severity as keyof AttackStats] as number || 0) + 1,
            lastUpdate: new Date().toISOString(),
          }));

          // Update time series
          setTimeSeriesData((prev) => {
            const grouped = groupByTimeInterval([newIncident, ...attackDetails]);
            return grouped;
          });
        }
      } catch (err) {
        console.warn("WS message error:", err);
      }
    };

    ws.onerror = (err) => console.warn("WS error:", err);

    return () => {
      try { ws.close(); } catch {}
    };
  }, [attackType]);

  const groupByTimeInterval = (incidents: AttackDetail[]) => {
    const grouped: Record<string, number> = {};
    
    incidents.forEach((inc) => {
      const date = new Date(inc.timestamp);
      const hour = date.getHours();
      const key = `${hour}:00`;
      grouped[key] = (grouped[key] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([time, count]) => ({ time, count }))
      .sort((a, b) => parseInt(a.time) - parseInt(b.time));
  };

  const severityPieData = [
    { name: "Critical", value: stats.critical, fill: SEVERITY_COLORS.critical },
    { name: "High", value: stats.high, fill: SEVERITY_COLORS.high },
    { name: "Medium", value: stats.medium, fill: SEVERITY_COLORS.medium },
    { name: "Low", value: stats.low, fill: SEVERITY_COLORS.low },
  ].filter((item) => item.value > 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <p className="text-xl text-gray-400">Loading attack details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link href="/analyst/dashboard" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          {attackType} Attack Details
        </h1>
        <p className="text-gray-400 mt-2">
          Last updated: {new Date(stats.lastUpdate).toLocaleString()}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-gradient-to-br from-blue-900/30 to-blue-900/10 rounded-lg border border-blue-500/30"
        >
          <p className="text-gray-400 text-sm">Total Attacks</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">{stats.total}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-gradient-to-br from-red-900/30 to-red-900/10 rounded-lg border border-red-500/30"
        >
          <p className="text-gray-400 text-sm">Critical</p>
          <p className="text-3xl font-bold text-red-400 mt-2">{stats.critical}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-gradient-to-br from-orange-900/30 to-orange-900/10 rounded-lg border border-orange-500/30"
        >
          <p className="text-gray-400 text-sm">High</p>
          <p className="text-3xl font-bold text-orange-400 mt-2">{stats.high}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-gradient-to-br from-yellow-900/30 to-yellow-900/10 rounded-lg border border-yellow-500/30"
        >
          <p className="text-gray-400 text-sm">Medium</p>
          <p className="text-3xl font-bold text-yellow-400 mt-2">{stats.medium}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-gradient-to-br from-green-900/30 to-green-900/10 rounded-lg border border-green-500/30"
        >
          <p className="text-gray-400 text-sm">Low</p>
          <p className="text-3xl font-bold text-green-400 mt-2">{stats.low}</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Time Series Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-[#0b1220] rounded-2xl border border-blue-900/40 shadow-lg"
        >
          <h3 className="text-xl font-bold text-blue-400 mb-4">Attacks Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="time" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e3a5f", borderRadius: "8px", color: "#fff" }}
              />
              <Area type="monotone" dataKey="count" stroke="#00d4ff" fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Severity Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-[#0b1220] rounded-2xl border border-purple-900/40 shadow-lg"
        >
          <h3 className="text-xl font-bold text-purple-400 mb-4">Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {severityPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e3a5f", borderRadius: "8px", color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Attack Incidents Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 bg-[#0b1220] rounded-2xl border border-green-900/40 shadow-lg"
      >
        <h3 className="text-xl font-bold text-green-400 mb-4">Recent Attack Incidents</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-3 text-left text-gray-300 font-semibold">Timestamp</th>
                <th className="p-3 text-left text-gray-300 font-semibold">Source IP</th>
                <th className="p-3 text-left text-gray-300 font-semibold">Method</th>
                <th className="p-3 text-left text-gray-300 font-semibold">Target</th>
                <th className="p-3 text-left text-gray-300 font-semibold">Severity</th>
                <th className="p-3 text-left text-gray-300 font-semibold">Payload</th>
              </tr>
            </thead>
            <tbody>
              {attackDetails.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No attack incidents yet
                  </td>
                </tr>
              ) : (
                attackDetails.map((incident, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-800 hover:bg-gray-900/30 transition"
                  >
                    <td className="p-3 text-gray-400">
                      {new Date(incident.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="p-3 font-mono text-blue-400">{incident.ip}</td>
                    <td className="p-3 text-gray-300">{incident.method || "-"}</td>
                    <td className="p-3 text-gray-300">{incident.target || "-"}</td>
                    <td className="p-3">
                      <span
                        className="px-2 py-1 rounded text-xs font-bold"
                        style={{
                          backgroundColor: SEVERITY_COLORS[incident.severity as keyof typeof SEVERITY_COLORS] + "33",
                          color: SEVERITY_COLORS[incident.severity as keyof typeof SEVERITY_COLORS],
                        }}
                      >
                        {incident.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400 truncate max-w-xs">
                      {incident.payload ? incident.payload.substring(0, 30) + "..." : "-"}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
