"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, User } from "lucide-react";

export default function NotificationsPage() {
  const [requests, setRequests] = useState([]);

  // Fetch pending analysts
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/admin/analysts/pending", {
          cache: "no-store",
        });

        const data = await res.json();
        setRequests(data.requests || []);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const approve = async (id) => {
    const res = await fetch("/api/admin/analysts/approve", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setRequests((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const reject = async (id) => {
    const res = await fetch("/api/admin/analysts/reject", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setRequests((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Pending Analyst Requests</h1>

      {requests.length === 0 ? (
        <p className="text-gray-400 text-lg">No pending requests</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="flex justify-between items-center p-5 rounded-xl bg-[#0a1e3f] border border-[#1d335c]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-[#1d2c4d] rounded-full">
                  <User className="w-6 h-6 text-white" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">{req.name}</h2>
                  <p className="text-gray-300 text-sm">{req.email}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => approve(req.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 transition rounded-lg"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve
                </button>

                <button
                  onClick={() => reject(req.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 transition rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}