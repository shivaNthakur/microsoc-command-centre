"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const ATTACK_TYPES = {
  bot_traffic: { label: "Bot Traffic", color: "#8b5cf6", icon: "🤖" },
  bot_detection: { label: "Bot Traffic", color: "#8b5cf6", icon: "🤖" },
  brute_force: { label: "Brute Force", color: "#ef4444", icon: "🔓" },
  dirscan: { label: "Directory Scan", color: "#f59e0b", icon: "📁" },
  directory_scan: { label: "Directory Scan", color: "#f59e0b", icon: "📁" },
  dos: { label: "DoS Attack", color: "#dc2626", icon: "💥" },
  dns_attack: { label: "DoS Attack", color: "#dc2626", icon: "💥" },
  gobuster_scan: { label: "Gobuster Scan", color: "#f97316", icon: "🔍" },
  vuln_scan: { label: "Vulnerability Scan", color: "#eab308", icon: "🐛" },
  nmap_scan: { label: "Nmap Scan", color: "#06b6d4", icon: "🗺️" },
  sensitive_paths: { label: "Sensitive Paths", color: "#ec4899", icon: "🔐" },
  sensitive_path_access: { label: "Sensitive Paths", color: "#ec4899", icon: "🔐" },
  sqli: { label: "SQL Injection", color: "#be123c", icon: "💉" },
  sql_injection: { label: "SQL Injection", color: "#be123c", icon: "💉" },
  xss: { label: "XSS Attack", color: "#7c2d12", icon: "⚡" },
  xss_attempt: { label: "XSS Attack", color: "#7c2d12", icon: "⚡" },
  threat_intelligence: { label: "Threat Intel", color: "#a855f7", icon: "🛡️" },
  normal: { label: "Normal", color: "#6b7280", icon: "✓" }
};

// Helper function to get attack type display info
function getAttackTypeInfo(attackType: string | null | undefined) {
  if (!attackType) return null;
  
  // Direct match
  if (ATTACK_TYPES[attackType as keyof typeof ATTACK_TYPES]) {
    return ATTACK_TYPES[attackType as keyof typeof ATTACK_TYPES];
  }
  
  // Fallback: return formatted version
  return {
    label: attackType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    color: "#6b7280",
    icon: "⚠️"
  };
}

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
  const [manualBlockIP, setManualBlockIP] = useState<string>("");
  const [modalAction, setModalAction] = useState<"block" | "unblock">("unblock");
  const socketRef = useRef<Socket | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    connectWebSocket();
    fetchInitialData();
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const connectWebSocket = () => {
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3002";
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

    socket.on("soc:attack_logs", (data: any) => {
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
    // Deduplicate by _id to prevent duplicates
    setLogs(prev => {
      // Check if log already exists
      const exists = prev.some(l => l._id === log._id);
      if (exists) return prev;
      
      // Add new log at the beginning and limit to 100
      return [log, ...prev].slice(0, 100);
    });
    
    if (log.severity === "HIGH" || log.severity === "CRITICAL") {
      audioRef.current?.play().catch(() => {});
    }
    updateStats(log);
    updateTimeline();
    updateBlockedIPs(log);
  };

  const processLogs = (initialLogs: AttackLog[]) => {
    // Deduplicate by _id
    const uniqueLogs = initialLogs.filter((log, index, self) => 
      index === self.findIndex(l => l._id === log._id)
    );
    setLogs(uniqueLogs.slice(0, 100));
    uniqueLogs.forEach(log => {
      updateStats(log);
      updateBlockedIPs(log);
    });
  };

  const updateStats = (log: AttackLog) => {
    if (!log.attack_type) return;
    setAttackStats(prev => {
      const attackInfo = getAttackTypeInfo(log.attack_type);
      const existing = prev.find(s => s.name === log.attack_type);
      if (existing) {
        return prev.map(s => s.name === log.attack_type ? { ...s, value: s.value + 1 } : s);
      }
      return [...prev, { 
        name: log.attack_type, 
        value: 1, 
        label: attackInfo?.label || log.attack_type 
      }];
    });
  };

  const updateTimeline = () => {
    const now = new Date().toLocaleTimeString();
    setTimeline(prev => {
      const last = prev[prev.length - 1];
      if (last && last.time === now) {
        // Same second - increment count
        return [...prev.slice(0, -1), { time: now, attacks: last.attacks + 1 }];
      }
      // New second - add new entry
      return [...prev.slice(-29), { time: now, attacks: 1 }];
    });
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
      const res = await fetch("/api/analyst/unblock-ip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip })
      });
      if (res.ok) {
        const result = await res.json();
        setBlockedIPs(prev => prev.filter(b => b.ip !== ip));
        setShowModal(false);
        alert(`IP ${ip} unblocked successfully (${result.updated_count} records updated)`);
      } else {
        const error = await res.json();
        alert(`Failed to unblock IP: ${error.message}`);
      }
    } catch (error) {
      console.error("Unblock error:", error);
      alert("Failed to unblock IP");
    }
  };

  const handleBlockIP = async (ip: string) => {
    if (!ip.trim()) {
      alert("Please enter a valid IP address");
      return;
    }
    try {
      const res = await fetch("/api/admin/block-ip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip })
      });
      if (res.ok) {
        const result = await res.json();
        setBlockedIPs(prev => {
          const existing = prev.find(b => b.ip === ip);
          if (existing) return prev;
          return [...prev, { ip, count: 0, lastSeen: Date.now() / 1000, attackTypes: [] }];
        });
        setManualBlockIP("");
        setShowModal(false);
        alert(`IP ${ip} blocked successfully`);
      } else {
        alert("Failed to block IP");
      }
    } catch (error) {
      alert("Failed to block IP");
    }
  };

  // Filter logs and ensure uniqueness
  const filteredLogs = (filter === "all" 
    ? logs 
    : logs.filter(log => {
        // Handle both direct match and mapped attack types
        const attackInfo = getAttackTypeInfo(log.attack_type);
        if (!attackInfo) return false;
        
        // Check if filter matches the attack type key or label
        return log.attack_type === filter || 
               attackInfo.label.toLowerCase().includes(filter.toLowerCase());
      })
  ).filter((log, index, self) => 
    // Deduplicate by _id
    index === self.findIndex(l => l._id === log._id)
  );

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
        <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-lg text-sm transition ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>
          All Attacks
        </button>
        {(() => {
          // Get unique attack types by label to avoid duplicate buttons
          const seenLabels = new Set<string>();
          const uniqueTypes: Array<[string, typeof ATTACK_TYPES[keyof typeof ATTACK_TYPES]]> = [];
          
          for (const [key, value] of Object.entries(ATTACK_TYPES)) {
            if (!seenLabels.has(value.label)) {
              seenLabels.add(value.label);
              uniqueTypes.push([key, value]);
            }
          }
          
          return uniqueTypes.map(([key, value]) => (
            <button 
              key={key} 
              onClick={() => setFilter(key)} 
              className={`px-4 py-2 rounded-lg text-sm transition ${filter === key ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              {value.icon} {value.label}
            </button>
          ));
        })()}
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
          <h2 className="text-lg font-semibold mb-4">Attack Types (Pie)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={attackStats} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={60} label>
                {attackStats.map((entry, index) => {
                  const attackInfo = getAttackTypeInfo(entry.name);
                  return (
                    <Cell key={index} fill={attackInfo?.color || "#6b7280"} />
                  );
                })}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-6 bg-gray-900 rounded-xl border border-gray-800 p-5">
        <h2 className="text-lg font-semibold mb-4">📊 Attack Types Distribution (All)</h2>
        {attackStats.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No attack data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(300, attackStats.length * 40)}>
            <BarChart data={attackStats} layout="vertical" margin={{ top: 5, right: 30, left: 200, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="label" type="category" stroke="#9ca3af" width={190} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" name="Count" radius={[0, 8, 8, 0]}>
                {attackStats.map((entry, index) => {
                  const attackInfo = getAttackTypeInfo(entry.name);
                  return (
                    <Cell key={index} fill={attackInfo?.color || "#6b7280"} />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
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
                  <th className="px-4 py-2 text-left text-xs text-gray-400">Suggestion</th>
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
                      {(() => {
                        const attackInfo = getAttackTypeInfo(log.attack_type);
                        if (attackInfo) {
                          return (
                            <span className="flex items-center gap-1">
                              <span>{attackInfo.icon}</span>
                              <span>{attackInfo.label}</span>
                            </span>
                          );
                        }
                        return <span className="text-gray-500">-</span>;
                      })()}
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
                    <td className="px-4 py-3 text-xs text-gray-300 max-w-xs">
                      {log.suggestion ? (
                        <span className="flex items-center gap-1" title={log.suggestion}>
                          <span>💡</span>
                          <span className="truncate">{log.suggestion}</span>
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-5 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold">🚫 Blocked IPs ({blockedIPs.length})</h2>
            <button
              onClick={() => {
                setModalAction("block");
                setManualBlockIP("");
                setShowModal(true);
              }}
              className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
            >
              + Block IP
            </button>
          </div>
          <div className="overflow-y-auto max-h-96 p-4 space-y-3">
            {blockedIPs.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No blocked IPs</div>
            ) : (
              blockedIPs.map((blocked) => (
                <div key={blocked.ip} className="bg-gray-800 p-3 rounded-lg border border-red-700/50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-sm font-bold text-red-400">{blocked.ip}</span>
                    <button
                      onClick={() => {
                        setModalAction("unblock");
                        setSelectedIP(blocked.ip);
                        setShowModal(true);
                      }}
                      className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded transition"
                    >
                      Unblock
                    </button>
                  </div>
                  <div className="text-xs text-gray-400">
                    <div>🔴 Attacks: {blocked.count}</div>
                    <div>📋 Types: {blocked.attackTypes.length > 0 ? blocked.attackTypes.join(", ") : "N/A"}</div>
                    <div>⏱️ Last: {new Date(blocked.lastSeen * 1000).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 max-w-md w-full mx-4">
            {modalAction === "unblock" ? (
              <>
                <h3 className="text-xl font-bold mb-4 text-red-400">🔓 Unblock IP</h3>
                <p className="text-gray-400 mb-4">
                  Are you sure you want to unblock <span className="font-mono text-red-400">{selectedIP}</span>?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUnblockIP(selectedIP)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                  >
                    ✓ Unblock
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4 text-red-400">🚫 Block IP Address</h3>
                <p className="text-gray-400 mb-4">Enter the IP address to block:</p>
                <input
                  type="text"
                  placeholder="e.g., 192.168.1.1"
                  value={manualBlockIP}
                  onChange={(e) => setManualBlockIP(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 mb-4 focus:outline-none focus:border-blue-500"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => handleBlockIP(manualBlockIP)}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
                  >
                    🚫 Block
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}