"use client";

import { useEffect, useState, useRef } from "react";

type IncidentData = {
  title?: string;
  severity?: string;
  source_ip: string;
  timestamp?: string;
  [k: string]: any;
};

type IPRow = {
  ip: string;
  count: number;
  lastSeen: string | null;
  highestSeverity: string | null;
};

export default function AttackerIPTable() {
  const [ipMap, setIpMap] = useState<Record<string, IPRow>>({});
  const wsRef = useRef<WebSocket | null>(null);

  // Helper: severity ranking so we can keep the "highest" severity seen
  const severityRank = (s?: string) => {
    if (!s) return 0;
    const map: Record<string, number> = {
      critical: 5,
      high: 4,
      medium: 3,
      low: 2,
      info: 1,
    };
    return map[(s || "").toLowerCase()] || 1;
  };

  // Merge incident into ipMap
  const addIncident = (inc: IncidentData) => {
    const ip = inc.source_ip || inc.sourceIp || inc.source || "unknown";
    const timestamp = inc.timestamp || new Date().toISOString();
    setIpMap(prev => {
      const copy = { ...prev };
      const existing = copy[ip];
      if (existing) {
        const newSeverity =
          severityRank(inc.severity) > severityRank(existing.highestSeverity || undefined)
            ? inc.severity || existing.highestSeverity
            : existing.highestSeverity;
        copy[ip] = {
          ip,
          count: existing.count + 1,
          lastSeen: timestamp,
          highestSeverity: newSeverity,
        };
      } else {
        copy[ip] = {
          ip,
          count: 1,
          lastSeen: timestamp,
          highestSeverity: inc.severity || null,
        };
      }
      return copy;
    });
  };

  // Initial load: fetch existing incidents to seed counts
  useEffect(() => {
    async function seed() {
      try {
        const res = await fetch("http://127.0.0.1:8000/ws/incidents");
        if (!res.ok) return;
        const data: any[] = await res.json();
        // reduce incidents into map
        const reduced: Record<string, IPRow> = {};
        data.forEach((inc: any) => {
          const ip = inc.source_ip || inc.sourceIp || "unknown";
          const ts = inc.timestamp || new Date().toISOString();
          const sev = inc.severity || null;
          if (reduced[ip]) {
            reduced[ip].count += 1;
            if (new Date(ts) > new Date(reduced[ip].lastSeen || 0)) reduced[ip].lastSeen = ts;
            if (severityRank(sev) > severityRank(reduced[ip].highestSeverity || undefined))
              reduced[ip].highestSeverity = sev;
          } else {
            reduced[ip] = {
              ip,
              count: 1,
              lastSeen: ts,
              highestSeverity: sev,
            };
          }
        });
        setIpMap(reduced);
      } catch (e) {
        console.warn("Could not seed incidents:", e);
      }
    }
    seed();
  }, []);

  // WebSocket: listen for live incidents
  useEffect(() => {
    const wsUrl = "ws://127.0.0.1:8000/ws/incidents";
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS connected to", wsUrl);
      // Optionally send a ping so server knows you're alive:
      try { ws.send("hello"); } catch {}
    };

    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        // handle both formats:
        // 1) { event: "new_incident", data: { ... } }
        // 2) directly an incident object
        if (msg?.event === "new_incident" && msg?.data) {
          addIncident(msg.data as IncidentData);
        } else if (msg?.source_ip || msg?.sourceIp) {
          // raw incident object
          addIncident(msg as IncidentData);
        } else {
          // no-op
        }
      } catch (err) {
        console.warn("WS message parse error:", err);
      }
    };

    ws.onclose = () => {
      console.log("WS disconnected");
    };

    ws.onerror = (err) => {
      console.warn("WS error", err);
    };

    return () => {
      try { ws.close(); } catch {}
      wsRef.current = null;
    };
  }, []);

  // Convert map to sorted array for UI
  const rows = Object.values(ipMap).sort((a, b) => b.count - a.count);

  return (
    <div className="p-4 bg-white rounded-md shadow-sm">
      <h3 className="text-xl font-semibold mb-3">Live Attacker IPs</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2">#</th>
              <th className="p-2">IP Address</th>
              <th className="p-2">Hits</th>
              <th className="p-2">Last Seen</th>
              <th className="p-2">Highest Severity</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No attacker IPs yet — run an attack to test.
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={r.ip} className="border-b hover:bg-gray-50">
                  <td className="p-2 align-top">{i + 1}</td>
                  <td className="p-2 font-mono">{r.ip}</td>
                  <td className="p-2">{r.count}</td>
                  <td className="p-2">{r.lastSeen ? new Date(r.lastSeen).toLocaleString() : "-"}</td>
                  <td className="p-2">{r.highestSeverity ?? "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}