"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  // Dashboard states
  const [totalAttacks, setTotalAttacks] = useState(0);
  const [modelAccuracy, setModelAccuracy] = useState(0);
  const [analystsRequested, setAnalystsRequested] = useState(0);
  const [analystsApproved, setAnalystsApproved] = useState(0);

  const [attackData, setAttackData] = useState([]);

  useEffect(() => {
    // MOCK DATA — REPLACE WITH BACKEND API CALLS
    const mock = {
      attacks: [
        { type: "DDoS", severity: 10, count: 12 },
        { type: "SQL Injection", severity: 7, count: 8 },
        { type: "XSS", severity: 5, count: 6 },
        { type: "Bruteforce", severity: 8, count: 10 },
      ],
      totalAttacks: 36,
      modelAccuracy: 80,
      analystsRequested: 14,
      analystsApproved: 10
    };

    setAttackData(mock.attacks);
    setTotalAttacks(mock.totalAttacks);
    setModelAccuracy(mock.modelAccuracy);
    setAnalystsRequested(mock.analystsRequested);
    setAnalystsApproved(mock.analystsApproved);

  }, []);

  const COLORS = ["#032760", "#0b0145", "#050113", "#5906a7"];

  return (
    <div className="w-full p-6 text-white space-y-10">

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
          <p className="text-4xl font-bold text-green-400 mt-3">{modelAccuracy}%</p>
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
  );
}
