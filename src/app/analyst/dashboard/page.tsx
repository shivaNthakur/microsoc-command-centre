"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/dashboard_analyst/Topbar";
import AttackCards from "@/components/dashboard_analyst/AttackCards";

interface Task {
  id: number;
  title: string;
  details: string;
  deadline: string;
  color: "blue" | "purple" | "red";
}

export default function AnalystDashboard() {
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);

  // Example tasks (replace with DB / Socket.io later)
  useEffect(() => {
    setAssignedTasks([
      {
        id: 1,
        title: "Investigate Suspicious IP",
        details: "IP: 103.88.1.44 — Possible Brute Force activity.",
        deadline: "Today",
        color: "blue",
      },
      {
        id: 2,
        title: "Analyze SQL Injection Pattern",
        details: "Logs from Singapore Data Center.",
        deadline: "2 Days",
        color: "purple",
      },
      {
        id: 3,
        title: "Critical Alert Review",
        details: "Critical Threat flagged at 02:11 AM.",
        deadline: "Immediate",
        color: "red",
      },
    ]);
  }, []);

  return (
    <>
      {/* TOPBAR */}
      <Topbar />

      {/* MAIN WRAPPER */}
      <div className="w-full min-h-screen px-6 py-8 bg-[#020617] text-white">

        {/* ----- RANGER IMAGE + WORK ASSIGNED SECTION ----- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT — RANGER IMAGE */}
          <div className="bg-[#0b1220] p-6 rounded-2xl border border-blue-900/40 shadow-lg flex items-center justify-center">
            <img
              src="/analyst_landing.jpg"
              alt="Ranger"
              className="w-full max-w-sm drop-shadow-[0_0_25px_rgba(0,150,255,0.5)] rounded-xl"
            />
          </div>

          {/* RIGHT — ASSIGNED TASKS CARD */}
          <div className="bg-[#0b1220] p-6 rounded-2xl border border-purple-900/40 shadow-lg">

            <h2 className="text-2xl font-bold text-blue-400 mb-3">
              Work Assigned
            </h2>

            <p className="text-gray-300 mb-6">
              Below are the tasks assigned to you by the Admin.
              Complete them before the deadline.
            </p>

            {/* TASK LIST */}
            <div className="space-y-4">
              {assignedTasks.map((task: Task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl bg-black/20 border shadow-md transition hover:scale-[1.02]
                    ${
                      task.color === "blue"
                        ? "border-blue-800/40 hover:bg-blue-900/10"
                        : task.color === "purple"
                        ? "border-purple-800/40 hover:bg-purple-900/10"
                        : "border-red-800/40 hover:bg-red-900/10"
                    }
                  `}
                >
                  <h3
                    className={`text-lg font-semibold ${
                      task.color === "blue"
                        ? "text-blue-300"
                        : task.color === "purple"
                        ? "text-purple-300"
                        : "text-red-300"
                    }`}
                  >
                    {task.title}
                  </h3>

                  <p className="text-gray-400 text-sm mt-1">{task.details}</p>

                  <p
                    className={`text-xs mt-2 ${
                      task.color === "blue"
                        ? "text-blue-400"
                        : task.color === "purple"
                        ? "text-purple-400"
                        : "text-red-400"
                    }`}
                  >
                    Deadline: {task.deadline}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ATTACK CARDS */}
        <div className="p-6">
          <AttackCards />
        </div>
      </div>
    </>
  );
}
