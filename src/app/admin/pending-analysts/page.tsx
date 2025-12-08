"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface PendingAnalyst {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function PendingAnalystsPage() {
  const [analysts, setAnalysts] = useState<PendingAnalyst[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingAnalysts();
  }, []);

  const fetchPendingAnalysts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/analysts/pending");
      const data = await res.json();
      setAnalysts(data.requests || []);
    } catch (error) {
      console.error("Error fetching pending analysts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    setActionInProgress(userId);
    try {
      const res = await fetch("/api/admin/analysts/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      });

      if (res.ok) {
        setAnalysts(analysts.filter((a) => a._id !== userId));
        alert("Analyst approved successfully!");
      } else {
        alert("Failed to approve analyst");
      }
    } catch (error) {
      console.error("Error approving analyst:", error);
      alert("Error approving analyst");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (userId: string) => {
    if (!window.confirm("Are you sure you want to reject this analyst?")) {
      return;
    }

    setActionInProgress(userId);
    try {
      const res = await fetch("/api/admin/analysts/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      });

      if (res.ok) {
        setAnalysts(analysts.filter((a) => a._id !== userId));
        alert("Analyst rejected successfully!");
      } else {
        alert("Failed to reject analyst");
      }
    } catch (error) {
      console.error("Error rejecting analyst:", error);
      alert("Error rejecting analyst");
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Pending Analyst Requests
          </h1>
          <p className="text-slate-400">
            Review and approve new analyst registrations
          </p>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Empty state */}
        {!loading && analysts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-800/50 rounded-lg p-12 text-center border border-slate-700"
          >
            <p className="text-slate-400 text-lg">
              No pending analyst requests at the moment
            </p>
          </motion.div>
        )}

        {/* Analysts list */}
        {!loading && analysts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {analysts.map((analyst, index) => (
              <motion.div
                key={analyst._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {analyst.name}
                    </h3>
                    <p className="text-slate-400">{analyst.email}</p>
                    <p className="text-sm text-slate-500 mt-2">
                      Applied on: {new Date(analyst.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 ml-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApprove(analyst._id)}
                      disabled={actionInProgress === analyst._id}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 text-white rounded-lg font-semibold transition"
                    >
                      {actionInProgress === analyst._id ? "Processing..." : "Approve"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReject(analyst._id)}
                      disabled={actionInProgress === analyst._id}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 text-white rounded-lg font-semibold transition"
                    >
                      {actionInProgress === analyst._id ? "Processing..." : "Reject"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
