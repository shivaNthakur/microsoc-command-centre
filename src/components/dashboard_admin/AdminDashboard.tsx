"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Analyst {
  _id: string;
  name: string;
  email: string;
  role: string;
  isApproved: boolean;
  createdAt: string;
}

interface PendingAnalyst {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

const COLORS = ["#032760", "#0b0145", "#050113", "#5906a7"];

// Memoized Stat Card Component
const StatCard = ({ title, value, color }: { title: string; value: string | number; color: string }) => (
  <div className="p-6 bg-gradient-to-br from-[#0f1c33] to-[#0a1224] rounded-xl shadow-lg border border-blue-800 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300">
    <h3 className="text-lg font-bold text-blue-400">{title}</h3>
    <p className={`text-4xl font-bold mt-3 ${color}`}>{value}</p>
  </div>
);

// Memoized Analyst Card Component
const AnalystCard = ({ analyst, onRemove, isRemoving }: { analyst: Analyst; onRemove: (id: string) => void; isRemoving: boolean }) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-blue-500/50 transition-colors duration-200 flex items-center justify-between">
    <div className="min-w-0 flex-1">
      <h3 className="text-lg font-semibold text-white truncate">{analyst.name}</h3>
      <p className="text-slate-400 text-sm truncate">{analyst.email}</p>
      <p className="text-xs text-slate-500 mt-1">
        Joined: {new Date(analyst.createdAt).toLocaleDateString()}
      </p>
    </div>
    <button
      onClick={() => onRemove(analyst._id)}
      disabled={isRemoving}
      className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 text-white text-sm rounded-lg font-semibold transition-colors duration-200 flex-shrink-0"
    >
      {isRemoving ? "..." : "Remove"}
    </button>
  </div>
);

// Memoized Pending Request Card Component
const RequestCard = ({ request, onApprove, onReject, isProcessing }: { request: PendingAnalyst; onApprove: (id: string) => void; onReject: (id: string) => void; isProcessing: boolean }) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-blue-500/50 transition-colors duration-200">
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-semibold text-white truncate">{request.name}</h3>
        <p className="text-slate-400 text-sm truncate">{request.email}</p>
        <p className="text-xs text-slate-500 mt-1">
          Applied: {new Date(request.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => onApprove(request._id)}
          disabled={isProcessing}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 text-white text-sm rounded-lg font-semibold transition-colors duration-200"
        >
          {isProcessing ? "..." : "Approve"}
        </button>
        <button
          onClick={() => onReject(request._id)}
          disabled={isProcessing}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 text-white text-sm rounded-lg font-semibold transition-colors duration-200"
        >
          {isProcessing ? "..." : "Reject"}
        </button>
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "analysts" | "requests">("overview");
  const [analysts, setAnalysts] = useState<Analyst[]>([]);
  const [pendingAnalysts, setPendingAnalysts] = useState<PendingAnalyst[]>([]);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dashboard states
  const [totalAttacks, setTotalAttacks] = useState(0);
  const [modelAccuracy, setModelAccuracy] = useState(0);
  const [attackData, setAttackData] = useState([]);

  // Memoized mock data
  const mockData = useMemo(() => ({
    attacks: [
      { type: "DDoS", severity: 10, count: 12 },
      { type: "SQL Injection", severity: 7, count: 8 },
      { type: "XSS", severity: 5, count: 6 },
      { type: "Bruteforce", severity: 8, count: 10 },
    ],
    totalAttacks: 36,
    modelAccuracy: 80,
  }), []);

  useEffect(() => {
    setAttackData(mockData.attacks);
    setTotalAttacks(mockData.totalAttacks);
    setModelAccuracy(mockData.modelAccuracy);

    // Fetch analysts and pending requests in parallel
    Promise.all([fetchAnalysts(), fetchPendingAnalysts()]).then(() => setIsLoading(false));
  }, [mockData]);

  const fetchAnalysts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/analysts", { cache: "no-store" });
      const data = await res.json();
      setAnalysts(data.analysts || []);
    } catch (error) {
      console.error("Error fetching analysts:", error);
    }
  }, []);

  const fetchPendingAnalysts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/analysts/pending", { cache: "no-store" });
      const data = await res.json();
      setPendingAnalysts(data.requests || []);
    } catch (error) {
      console.error("Error fetching pending analysts:", error);
    }
  }, []);

  const handleApprove = useCallback(async (userId: string) => {
    setActionInProgress(userId);
    try {
      const res = await fetch("/api/admin/analysts/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPendingAnalysts(prev => prev.filter((a) => a._id !== userId));
        setAnalysts(prev => [...prev, { ...data.user, _id: data.user._id.toString() }]);
      } else {
        throw new Error(data.message || "Failed to approve analyst");
      }
    } catch (error) {
      console.error("Error approving analyst:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Failed to approve"}`);
    } finally {
      setActionInProgress(null);
    }
  }, []);

  const handleReject = useCallback(async (userId: string) => {
    if (!window.confirm("Are you sure you want to reject this analyst?")) return;
    
    setActionInProgress(userId);
    try {
      const res = await fetch("/api/admin/analysts/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPendingAnalysts(prev => prev.filter((a) => a._id !== userId));
      } else {
        throw new Error(data.message || "Failed to reject analyst");
      }
    } catch (error) {
      console.error("Error rejecting analyst:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Failed to reject"}`);
    } finally {
      setActionInProgress(null);
    }
  }, []);

  const handleRemoveAnalyst = useCallback(async (userId: string) => {
    if (!window.confirm("Are you sure you want to remove this analyst?")) return;
    
    setActionInProgress(userId);
    try {
      const res = await fetch(`/api/admin/analysts/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAnalysts(prev => prev.filter((a) => a._id !== userId));
      } else {
        throw new Error("Failed to remove analyst");
      }
    } catch (error) {
      console.error("Error removing analyst:", error);
      alert("Error removing analyst");
    } finally {
      setActionInProgress(null);
    }
  }, []);

  return (
    <div className="w-full p-6 text-white space-y-6">

      {/* TABS */}
      <div className="flex gap-4 border-b border-blue-800">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-3 font-semibold transition-colors duration-200 ${
            activeTab === "overview"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-slate-400 hover:text-blue-300"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("analysts")}
          className={`px-6 py-3 font-semibold transition-colors duration-200 relative ${
            activeTab === "analysts"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-slate-400 hover:text-blue-300"
          }`}
        >
          Analysts {analysts.length > 0 && <span className="ml-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">{analysts.length}</span>}
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-6 py-3 font-semibold transition-colors duration-200 relative ${
            activeTab === "requests"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-slate-400 hover:text-blue-300"
          }`}
        >
          Pending Requests {pendingAnalysts.length > 0 && <span className="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">{pendingAnalysts.length}</span>}
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* TOP CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Attacks" value={totalAttacks} color="text-white" />
            <StatCard title="LSTM Accuracy" value={`${modelAccuracy}%`} color="text-green-400" />
            <StatCard title="Total Analysts" value={analysts.length} color="text-green-300" />
            <StatCard title="Pending Requests" value={pendingAnalysts.length} color="text-yellow-400" />
          </div>

          {/* GRAPHS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0b1220] p-6 rounded-xl border border-blue-700 shadow-xl">
              <h2 className="text-xl font-bold text-blue-400 mb-4">Attack Severity</h2>
              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attackData}>
                    <XAxis dataKey="type" stroke="#93c5fd" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#93c5fd" style={{ fontSize: "12px" }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="severity" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#0b1220] p-6 rounded-xl border border-blue-700 shadow-xl">
              <h2 className="text-xl font-bold text-blue-400 mb-4">Distribution</h2>
              <div className="w-full h-[250px] flex justify-center">
                <ResponsiveContainer width="90%" height="100%">
                  <PieChart>
                    <Pie
                      data={attackData}
                      dataKey="count"
                      nameKey="type"
                      outerRadius={70}
                      label={false}
                    >
                      {attackData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <div className="bg-[#0b1220] p-6 rounded-xl border border-blue-700 shadow-xl text-center">
            <button
              onClick={() => router.push("/admin/dashboard/location")}
              className="px-10 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors duration-200 shadow-lg"
            >
              View Attack Locations
            </button>
          </div>
        </div>
      )}

      {/* ANALYSTS TAB */}
      {activeTab === "analysts" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-blue-400">Approved Analysts ({analysts.length})</h2>

          {analysts.length === 0 ? (
            <div className="bg-slate-800/50 rounded-lg p-12 text-center border border-slate-700">
              <p className="text-slate-400">No approved analysts yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {analysts.map((analyst) => (
                <AnalystCard
                  key={analyst._id}
                  analyst={analyst}
                  onRemove={handleRemoveAnalyst}
                  isRemoving={actionInProgress === analyst._id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* REQUESTS TAB */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-blue-400">Pending Requests ({pendingAnalysts.length})</h2>

          {pendingAnalysts.length === 0 ? (
            <div className="bg-slate-800/50 rounded-lg p-12 text-center border border-slate-700">
              <p className="text-slate-400">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingAnalysts.map((request) => (
                <RequestCard
                  key={request._id}
                  request={request}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isProcessing={actionInProgress === request._id}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
