"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ATTACK_TYPES = {
  bot_traffic: { label: "Bot Traffic", color: "#8b5cf6", icon: "🤖" },
  brute_force: { label: "Brute Force", color: "#ef4444", icon: "🔓" },
  dirscan: { label: "Directory Scan", color: "#f59e0b", icon: "📁" },
  dos: { label: "DoS Attack", color: "#dc2626", icon: "💥" },
  gobuster_scan: { label: "Gobuster Scan", color: "#f97316", icon: "🔍" },
  vuln_scan: { label: "Vulnerability Scan", color: "#eab308", icon: "🐛" },
  nmap_scan: { label: "Nmap Scan", color: "#06b6d4", icon: "🗺️" },
  sensitive_paths: { label: "Sensitive Paths", color: "#ec4899", icon: "🔐" },
  sqli: { label: "SQL Injection", color: "#be123c", icon: "💉" },
  xss: { label: "XSS Attack", color: "#7c2d12", icon: "⚡" }
};

interface AttackLog {
  _id: string;
  ip: string;
  path: string;
  method: string;
  status: string;
  attack_type: keyof typeof ATTACK_TYPES | null;
  severity: string;
  timestamp: number;
  reason: string;
  suggestion: string | null;
  is_blocked_now: boolean;
}

interface BlockedIP {
  ip: string;
  count: number;
  lastSeen: number;
  attackTypes: string[];
}

export default function AnalystDashboard() {
  const [logs, setLogs] = useState<AttackLog[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([]);
  const [attackStats, setAttackStats] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedIP, setSelectedIP] = useState<string>("");
  const socketRef = useRef<Socket | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    connectWebSocket();
    fetchInitialData();
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const connectWebSocket = () => {
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
    const socket = io(SOCKET_URL, { transports: ["websocket"] });

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join_analyst");
    });

    socket.on("attack_log", (data: any) => {
      handleNewLog(data);
    });

    socket.on("new_log", (data: any) => {
      handleNewLog(data);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socketRef.current = socket;
  };

  const fetchInitialData = async () => {
    try {
      const res = await fetch("/api/logs/ingest");
      const data = await res.json();
      if (data.success) processLogs(data.logs || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleNewLog = (log: AttackLog) => {
    setLogs(prev => [log, ...prev].slice(0, 100));
    if (log.severity === "HIGH" || log.severity === "CRITICAL") {
      audioRef.current?.play().catch(() => {});
    }
    updateStats(log);
    updateTimeline();
    updateBlockedIPs(log);
  };

  const processLogs = (initialLogs: AttackLog[]) => {
    setLogs(initialLogs.slice(0, 100));
    initialLogs.forEach(log => {
      updateStats(log);
      updateBlockedIPs(log);
    });
  };

  const updateStats = (log: AttackLog) => {
    if (!log.attack_type) return;
    setAttackStats(prev => {
      const existing = prev.find(s => s.name === log.attack_type);
      if (existing) {
        return prev.map(s => s.name === log.attack_type ? { ...s, value: s.value + 1 } : s);
      }
      return [...prev, { name: log.attack_type, value: 1, label: ATTACK_TYPES[log.attack_type]?.label || log.attack_type }];
    });
  };

  const updateTimeline = () => {
    const now = new Date().toLocaleTimeString();
    setTimeline(prev => [...prev.slice(-29), { time: now, attacks: 1 }]);
  };

  const updateBlockedIPs = (log: AttackLog) => {
    if (!log.is_blocked_now) return;
    setBlockedIPs(prev => {
      const existing = prev.find(b => b.ip === log.ip);
      if (existing) {
        return prev.map(b => b.ip === log.ip ? {
          ...b, count: b.count + 1, lastSeen: log.timestamp,
          attackTypes: [...new Set([...b.attackTypes, log.attack_type || "unknown"])]
        } : b);
      }
      return [...prev, { ip: log.ip, count: 1, lastSeen: log.timestamp, attackTypes: [log.attack_type || "unknown"] }].slice(-20);
    });
  };

  const handleUnblockIP = async (ip: string) => {
    try {
      const res = await fetch("/api/admin/unblock-ip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip })
      });
      if (res.ok) {
        setBlockedIPs(prev => prev.filter(b => b.ip !== ip));
        setShowModal(false);
        alert(`IP ${ip} unblocked`);
      }
    } catch (error) {
      alert("Failed to unblock IP");
    }
  };

  const filteredLogs = filter === "all" ? logs : logs.filter(log => log.attack_type === filter);

  const getSeverityColor = (severity: string) => {
    const colors = {
      CRITICAL: "bg-red-900 text-red-100 border-red-700",
      HIGH: "bg-orange-900 text-orange-100 border-orange-700",
      MEDIUM: "bg-yellow-900 text-yellow-100 border-yellow-700",
      LOW: "bg-blue-900 text-blue-100 border-blue-700"
    };
    return colors[severity as keyof typeof colors] || "bg-gray-800 text-gray-300 border-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a" />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🛡️ Attack Monitoring Dashboard</h1>
          <p className="text-gray-400 mt-1">Real-time threat detection</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${connected ? "bg-green-900/30 border border-green-700" : "bg-red-900/30 border border-red-700"}`}>
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
          <span className="text-sm">{connected ? "Live" : "Disconnected"}</span>
        </div>
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-lg text-sm ${filter === "all" ? "bg-blue-600" : "bg-gray-800"}`}>
          All Attacks
        </button>
        {Object.entries(ATTACK_TYPES).map(([key, value]) => (
          <button key={key} onClick={() => setFilter(key)} className={`px-4 py-2 rounded-lg text-sm ${filter === key ? "bg-blue-600" : "bg-gray-800"}`}>
            {value.icon} {value.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
          <div className="text-gray-400 text-sm">Total Attacks</div>
          <div className="text-3xl font-bold">{logs.length}</div>
        </div>
        <div className="bg-red-900/30 p-5 rounded-xl border border-red-700/50">
          <div className="text-red-300 text-sm">Blocked IPs</div>
          <div className="text-3xl font-bold text-red-400">{blockedIPs.length}</div>
        </div>
        <div className="bg-orange-900/30 p-5 rounded-xl border border-orange-700/50">
          <div className="text-orange-300 text-sm">High Severity</div>
          <div className="text-3xl font-bold text-orange-400">
            {logs.filter(l => l.severity === "HIGH" || l.severity === "CRITICAL").length}
          </div>
        </div>
        <div className="bg-green-900/30 p-5 rounded-xl border border-green-700/50">
          <div className="text-green-300 text-sm">Recent (5 min)</div>
          <div className="text-3xl font-bold text-green-400">
            {logs.filter(l => l.timestamp > Date.now() / 1000 - 300).length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h2 className="text-lg font-semibold mb-4">Attack Timeline</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
              <Line type="monotone" dataKey="attacks" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h2 className="text-lg font-semibold mb-4">Attack Types</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={attackStats} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={80} label>
                {attackStats.map((entry, index) => (
                  <Cell key={index} fill={ATTACK_TYPES[entry.name as keyof typeof ATTACK_TYPES]?.color || "#6b7280"} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-5 border-b border-gray-800">
            <h2 className="text-lg font-semibold">Live Attack Logs</h2>
          </div>
          <div className="overflow-y-auto max-h-96">
            <table className="w-full">
              <thead className="bg-gray-800 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs text-gray-400">Time</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-400">IP</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-400">Attack</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-400">Severity</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(log.timestamp * 1000).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono">{log.ip}</td>
                    <td className="px-4 py-3 text-xs">
                      {log.attack_type && (
                        <span className="flex items-center gap-1">
                          <span>{ATTACK_TYPES[log.attack_type]?.icon}</span>
                          <span>{ATTACK_TYPES[log.attack_type]?.label}</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded border ${getSeverityColor(log.severity)}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded ${log.is_blocked_now ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                        {log.is_blocked_now ? "BLOCKED" : log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-5 border-b border-gray-800">
            <h2 className="text-lg font-semibold">Blocked IPs</h2>
          </div>
          <div className="overflow-y-auto max-h-96 p-4 space-y-3">
            {blockedIPs.map((blocked) => (
              <div key={blocked.ip} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-sm font-bold text-red-400">{blocked.ip}</span>
                  <button
                    onClick={() => { setSelectedIP(blocked.ip); setShowModal(true); }}
                    className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded"
                  >
                    Unblock
                  </button>
                </div>
                <div className="text-xs text-gray-400">
                  <div>Attacks: {blocked.count}</div>
                  <div>Types: {blocked.attackTypes.join(", ")}</div>
                  <div>Last: {new Date(blocked.lastSeen * 1000).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 max-w-md">
            <h3 className="text-xl font-bold mb-4">Unblock IP</h3>
            <p className="text-gray-400 mb-4">
              Unblock <span className="font-mono text-red-400">{selectedIP}</span>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => handleUnblockIP(selectedIP)} className="flex-1 px-4 py-2 bg-blue-600 rounded-lg">
                Yes
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-800 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}