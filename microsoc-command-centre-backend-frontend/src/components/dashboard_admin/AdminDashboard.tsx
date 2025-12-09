"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
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

export default function AdminDashboard() {
  const router = useRouter();

  // Dashboard states
  const [activeTab, setActiveTab] = useState<"overview" | "analysts" | "pending">("overview");
  const [totalAttacks, setTotalAttacks] = useState(0);
  const [modelAccuracy, setModelAccuracy] = useState(0);
  const [analystsRequested, setAnalystsRequested] = useState(0);
  const [analystsApproved, setAnalystsApproved] = useState(0);
  const [attackData, setAttackData] = useState<Array<{ type: string; severity: number; count: number }>>([]);
  const [loading, setLoading] = useState(true);
  
  // Analyst management states
  const [analysts, setAnalysts] = useState<Analyst[]>([]);
  const [pendingAnalysts, setPendingAnalysts] = useState<PendingAnalyst[]>([]);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Fetch analysts and pending requests
  const fetchAnalysts = async () => {
    try {
      const res = await fetch('/api/admin/analysts');
      const data = await res.json();
      if (data.success) {
        setAnalysts(data.analysts || []);
      }
    } catch (error) {
      console.error('Error fetching analysts:', error);
    }
  };

  const fetchPendingAnalysts = async () => {
    try {
      const res = await fetch('/api/admin/analysts/pending');
      const data = await res.json();
      if (data.success) {
        setPendingAnalysts(data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching pending analysts:', error);
    }
  };

  // Approve analyst
  const handleApprove = async (id: string) => {
    if (actionInProgress) return;
    setActionInProgress(id);
    try {
      const res = await fetch('/api/admin/analysts/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        alert('Analyst approved successfully!');
        await fetchPendingAnalysts();
        await fetchAnalysts();
      } else {
        alert(`Failed to approve: ${data.message}`);
      }
    } catch (error) {
      alert('Error approving analyst');
      console.error(error);
    } finally {
      setActionInProgress(null);
    }
  };

  // Reject analyst
  const handleReject = async (id: string) => {
    if (actionInProgress) return;
    if (!confirm('Are you sure you want to reject this analyst request?')) return;
    setActionInProgress(id);
    try {
      const res = await fetch('/api/admin/analysts/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        alert('Analyst request rejected');
        await fetchPendingAnalysts();
      } else {
        alert(`Failed to reject: ${data.message}`);
      }
    } catch (error) {
      alert('Error rejecting analyst');
      console.error(error);
    } finally {
      setActionInProgress(null);
    }
  };

  // Remove analyst
  const handleRemove = async (id: string) => {
    if (actionInProgress) return;
    if (!confirm('Are you sure you want to remove this analyst?')) return;
    setActionInProgress(id);
    try {
      const res = await fetch(`/api/admin/analysts/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        alert('Analyst removed successfully');
        await fetchAnalysts();
      } else {
        alert(`Failed to remove: ${data.message}`);
      }
    } catch (error) {
      alert('Error removing analyst');
      console.error(error);
    } finally {
      setActionInProgress(null);
    }
  };

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        // Fetch attack statistics
        const statsResponse = await fetch('/api/admin/dashboard/attack-stats');
        if (!statsResponse.ok) throw new Error('Failed to fetch attack stats');
        
        const statsData = await statsResponse.json();
        if (statsData.success && statsData.data) {
          setAttackData(statsData.data.attacks || []);
          setTotalAttacks(statsData.data.totalAttacks || 0);
          setModelAccuracy(statsData.data.modelAccuracy || 0);
          setAnalystsRequested(statsData.data.analystsRequested || 0);
          setAnalystsApproved(statsData.data.analystsApproved || 0);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to empty data on error
        setAttackData([]);
        setTotalAttacks(0);
        setModelAccuracy(0);
        setAnalystsRequested(0);
        setAnalystsApproved(0);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
    fetchAnalysts();
    fetchPendingAnalysts();
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchAnalysts();
      fetchPendingAnalysts();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const COLORS = ["#032760", "#0b0145", "#050113", "#5906a7", "#7c3aed", "#ec4899"];

  if (loading) {
    return (
      <div className="w-full p-6 text-white flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 text-white space-y-6">
      {/* TABS */}
      <div className="flex gap-2 border-b border-blue-800">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === "overview"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("analysts")}
          className={`px-6 py-3 font-semibold transition-colors relative ${
            activeTab === "analysts"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Analysts
          {analysts.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 rounded-full">
              {analysts.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-6 py-3 font-semibold transition-colors relative ${
            activeTab === "pending"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Pending Requests
          {pendingAnalysts.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-600 rounded-full">
              {pendingAnalysts.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "overview" && (
        <div className="space-y-10">

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Total Attacks */}
        <div className="p-6 bg-gradient-to-br from-[#0f1c33] to-[#0a1224]
          rounded-xl shadow-lg border border-blue-800
          hover:shadow-blue-500/40 hover:scale-[1.03] transition">
          <h3 className="text-xl font-bold text-blue-400">Total Attacks</h3>
          <p className="text-4xl font-bold text-white mt-3">{totalAttacks}</p>
        </div>

        {/* LSTM Accuracy */}
        <div className="p-6 bg-gradient-to-br from-[#0f1c33] to-[#0a1224]
          rounded-xl shadow-lg border border-blue-800
          hover:shadow-blue-500/40 hover:scale-[1.03] transition">
          <h3 className="text-xl font-bold text-blue-400">LSTM Accuracy</h3>
          <p className="text-4xl font-bold text-green-400 mt-3">{80.02}%</p>
        </div>

        {/* Analysts Requested */}
        <div className="p-6 bg-gradient-to-br from-[#0f1c33] to-[#0a1224]
          rounded-xl shadow-lg border border-blue-800
          hover:shadow-blue-500/40 hover:scale-[1.03] transition">
          <h3 className="text-xl font-bold text-blue-400">Analysts Requested</h3>
          <p className="text-4xl font-bold text-yellow-400 mt-3">{analystsRequested}</p>
        </div>

        {/* Analysts Approved */}
        <div className="p-6 bg-gradient-to-br from-[#0f1c33] to-[#0a1224]
          rounded-xl shadow-lg border border-blue-800
          hover:shadow-blue-500/40 hover:scale-[1.03] transition">
          <h3 className="text-xl font-bold text-blue-400">Analysts Approved</h3>
          <p className="text-4xl font-bold text-green-300 mt-3">{analystsApproved}</p>
        </div>

      </div>

      {/* GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* BAR CHART */}
        <div className="bg-[#0b1220] p-6 rounded-xl border border-blue-700 shadow-xl">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Attack Severity Chart</h2>

          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attackData}>
                <XAxis dataKey="type" stroke="#93c5fd" />
                <YAxis stroke="#93c5fd" />
                <Tooltip />
                <Legend />
                <Bar dataKey="severity" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="bg-[#0b1220] p-6 rounded-xl border border-blue-700 shadow-xl">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Attack Distribution</h2>

          <div className="w-full h-[250px] flex justify-center">
            <ResponsiveContainer width="90%" height="100%">
              <PieChart>
                <Pie
                  data={attackData}
                  dataKey="count"
                  nameKey="type"
                  outerRadius={85}
                  label
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
              className="px-10 py-4 bg-blue-500 text-white text-lg font-bold 
                rounded-xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/50 
                transition-all"
            >
              View Attack Locations on Globe
            </button>
          </div>
        </div>
      )}

      {activeTab === "analysts" && (
        <div className="space-y-6">
          <div className="bg-[#0b1220] p-6 rounded-xl border border-blue-700 shadow-xl">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">Approved Analysts ({analysts.length})</h2>
            {analysts.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No approved analysts yet</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysts.map((analyst) => (
                  <div
                    key={analyst._id}
                    className="bg-gray-900 p-4 rounded-lg border border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-white">{analyst.name}</h3>
                        <p className="text-sm text-gray-400">{analyst.email}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(analyst._id)}
                        disabled={actionInProgress === analyst._id}
                        className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 rounded transition disabled:opacity-50"
                      >
                        {actionInProgress === analyst._id ? "..." : "Remove"}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Joined: {new Date(analyst.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "pending" && (
        <div className="space-y-6">
          <div className="bg-[#0b1220] p-6 rounded-xl border border-blue-700 shadow-xl">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              Pending Analyst Requests ({pendingAnalysts.length})
            </h2>
            {pendingAnalysts.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No pending requests</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingAnalysts.map((analyst) => (
                  <div
                    key={analyst._id}
                    className="bg-gray-900 p-4 rounded-lg border border-yellow-700"
                  >
                    <h3 className="font-semibold text-white mb-1">{analyst.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{analyst.email}</p>
                    <p className="text-xs text-gray-500 mb-4">
                      Applied: {new Date(analyst.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(analyst._id)}
                        disabled={actionInProgress === analyst._id}
                        className="flex-1 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 rounded transition disabled:opacity-50"
                      >
                        {actionInProgress === analyst._id ? "..." : "✓ Approve"}
                      </button>
                      <button
                        onClick={() => handleReject(analyst._id)}
                        disabled={actionInProgress === analyst._id}
                        className="flex-1 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 rounded transition disabled:opacity-50"
                      >
                        {actionInProgress === analyst._id ? "..." : "✗ Reject"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
