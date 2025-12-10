"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Globe from "react-globe.gl";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";

type GeoPoint = {
  id: string;
  ip: string;
  lat: number;
  lng: number;
  country?: string;
  city?: string;
};

type Arc = {
  id: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [number, number, number, number][];
  dashLength: number;
  stroke: number;
};

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
const STORAGE_KEY = "globe_attacks";
const MAX_STORED_POINTS = 300;

export default function InteractiveGlobe() {
  const router = useRouter();
  const globeEl = useRef<any>(null);

  const [pointsData, setPointsData] = useState<GeoPoint[]>([]);
  const [arcsData, setArcsData] = useState<Arc[]>([]);
  const [autoRotate] = useState(true);
  const [speed] = useState(0.8);
  const [loading, setLoading] = useState(true);

  // Load points from localStorage on mount
  useEffect(() => {
    console.log("🔄 Loading saved attacks from localStorage...");
    const savedData = localStorage.getItem(STORAGE_KEY);
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.points && Array.isArray(parsed.points)) {
          setPointsData(parsed.points);
          setArcsData(parsed.arcs || []);
          console.log(`✅ Loaded ${parsed.points.length} saved attacks`);
        }
      } catch (error) {
        console.error("❌ Failed to parse saved data:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    
    setLoading(false);
  }, []);

  // Save points to localStorage whenever they change
  useEffect(() => {
    if (!loading && pointsData.length > 0) {
      const dataToSave = {
        points: pointsData,
        arcs: arcsData,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      console.log(`💾 Saved ${pointsData.length} attacks to localStorage`);
    }
  }, [pointsData, arcsData, loading]);

  const addIpToGlobe = useCallback(async (ip: string) => {
    try {
      console.log("🔵 addIpToGlobe for", ip);

      const res = await fetch(
        `/api/admin/dashboard/geo?ip=${encodeURIComponent(ip)}`
      );
      const json = await res.json();

      if (!json.success) {
        console.warn("Geo failed for", ip, json);
        return;
      }

      const geo = json.data as {
        lat: number;
        lng: number;
        country?: string;
        city?: string;
      };

      const point: GeoPoint = {
        id: `${ip}-${Date.now()}`,
        ip,
        lat: geo.lat,
        lng: geo.lng,
        country: geo.country,
        city: geo.city,
      };

      // Update points and arcs together
      setPointsData((prevPoints) => {
        const nextPoints = [...prevPoints, point];

        // Create an arc from previous point to this one
        if (nextPoints.length >= 2) {
          const from = nextPoints[nextPoints.length - 2];
          const to = nextPoints[nextPoints.length - 1];

          const newArc: Arc = {
            id: `arc-${from.id}-${to.id}`,
            startLat: from.lat,
            startLng: from.lng,
            endLat: to.lat,
            endLng: to.lng,
            color: [
              [255, 0, 180, 0.9],
              [0, 180, 255, 0.9],
            ],
            dashLength: 0.5,
            stroke: 2,
          };

          setArcsData((prevArcs) => {
            const nextArcs = [...prevArcs, newArc];
            return nextArcs.slice(-MAX_STORED_POINTS);
          });
        }

        return nextPoints.slice(-MAX_STORED_POINTS);
      });
    } catch (err) {
      console.error("Failed to fetch geo for IP", ip, err);
    }
  }, []);

  // Load existing attacks from database on mount
  const loadExistingAttacks = useCallback(async () => {
    console.log("📊 Loading recent attacks from database...");
    
    try {
      const response = await fetch("/api/logs/ingest");
      const data = await response.json();
      
      if (data.success && data.logs) {
        console.log(`📥 Found ${data.logs.length} logs in database`);
        
        // Get unique IPs (recent first)
        const uniqueIPs = new Set<string>();
        const recentLogs = data.logs
          .sort((a: any, b: any) => b.timestamp - a.timestamp)
          .slice(0, 50); // Last 50 attacks
        
        for (const log of recentLogs) {
          if (log.ip && !uniqueIPs.has(log.ip)) {
            uniqueIPs.add(log.ip);
          }
        }
        
        console.log(`🌍 Loading ${uniqueIPs.size} unique IPs to globe...`);
        
        // Add each IP to globe with delay
        for (const ip of Array.from(uniqueIPs)) {
          await addIpToGlobe(ip);
          await new Promise(r => setTimeout(r, 200)); // 200ms delay
        }
        
        console.log("✅ Finished loading existing attacks");
      }
    } catch (error) {
      console.error("❌ Failed to load existing attacks:", error);
    }
  }, [addIpToGlobe]);

  // WebSocket for real-time updates
  useEffect(() => {
    const socket: Socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    console.log("🌐 Connecting Globe socket →", SOCKET_URL);

    socket.on("connect", () => {
      console.log("✅ Globe socket connected", socket.id);
      socket.emit("join_analyst");
    });

    socket.on("attack_log", (log: any) => {
      console.log("🔥 attack_log on globe:", log);
      if (log?.ip) addIpToGlobe(log.ip);
    });

    socket.on("new_log", (log: any) => {
      console.log("🔥 new_log on globe:", log);
      if (log?.ip) addIpToGlobe(log.ip);
    });

    socket.on("attack_batch", (payload: { ips: string[] }) => {
      console.log("🔥 attack_batch", payload);
      payload.ips?.forEach((ip) => addIpToGlobe(ip));
    });

    socket.on("disconnect", () => {
      console.log("❌ Globe socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [addIpToGlobe]);

  // Auto-rotation
  useEffect(() => {
    if (!globeEl.current) return;
    const controls = globeEl.current.controls();
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = speed;
  }, [autoRotate, speed]);

  const cameraShake = () => {
    const controls = globeEl.current?.controls?.();
    if (!controls) return;
    const orig = controls.autoRotateSpeed;
    controls.autoRotateSpeed = orig + 0.8;
    setTimeout(() => {
      controls.autoRotateSpeed = orig;
    }, 500);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    router.push("/");
  };

  const goToDashboard = () => {
    router.push("/admin/dashboard");
  };

  const clearGlobeData = () => {
    if (confirm("Clear all dots from globe?")) {
      setPointsData([]);
      setArcsData([]);
      localStorage.removeItem(STORAGE_KEY);
      console.log("🗑️ Cleared globe data");
    }
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-[#010413] text-white">
      {/* Info Box */}
      <div className="absolute top-4 left-6 z-50 bg-black/40 backdrop-blur-lg px-4 py-3 rounded-xl border border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.5)] w-72">
        <h2 className="text-purple-300 font-semibold">Attack Globe Viewer</h2>
        <p className="text-gray-200 text-sm mt-1 leading-relaxed">
          Visualizing attack origins on an interactive 3D globe. Data persists across refreshes.
        </p>
      </div>

      {/* Top right buttons */}
      <div className="absolute top-4 right-6 z-50 flex gap-3">
        <button
          onClick={loadExistingAttacks}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-semibold shadow-md text-sm"
        >
          📊 Load DB
        </button>

        <button
          onClick={clearGlobeData}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 transition rounded-lg font-semibold shadow-md text-sm"
        >
          🗑️ Clear
        </button>

        <button
          onClick={goToDashboard}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-800 transition rounded-lg font-semibold shadow-md"
        >
          Dashboard
        </button>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-900 transition rounded-lg font-semibold shadow-md"
        >
          Logout
        </button>
      </div>

      {/* Background */}
      <div className="absolute inset-0 -z-10 opacity-40 bg-[url('https://i.ibb.co/3Tg4xJ8/stars2.png')] bg-cover animate-pulse" />

      {/* Globe */}
      <Globe
        ref={globeEl}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        pointsData={pointsData}
        pointLat={(d: GeoPoint) => d.lat}
        pointLng={(d: GeoPoint) => d.lng}
        pointRadius={() => 0.18}
        pointAltitude={() => 0.01}
        pointColor={() => "red"}
        pointLabel={(d: GeoPoint) => `
          <div style="background: rgba(0,0,0,0.8); padding: 8px; border-radius: 4px; color: white;">
            <b>IP:</b> ${d.ip}<br/>
            <b>Location:</b> ${d.city || 'Unknown'}, ${d.country || 'Unknown'}
          </div>
        `}
        arcsData={arcsData}
        arcStartLat={(d: Arc) => d.startLat}
        arcStartLng={(d: Arc) => d.startLng}
        arcEndLat={(d: Arc) => d.endLat}
        arcEndLng={(d: Arc) => d.endLng}
        arcColor={(d: Arc) => d.color}
        arcDashLength={(d: Arc) => d.dashLength}
        arcDashGap={1}
        arcDashAnimateTime={1500}
        arcAltitude={0.25}
        arcStroke={(d: Arc) => d.stroke}
        showAtmosphere
        atmosphereColor="rgba(120, 0, 255, 0.4)"
        atmosphereAltitude={0.25}
        onPointClick={cameraShake}
        onArcClick={cameraShake}
      />

      {/* Stats card */}
      <div className="absolute left-6 bottom-6 p-4 bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.5)] w-72 z-20">
        <h2 className="font-bold text-purple-300 mb-2">Attack Statistics</h2>
        <p className="text-purple-200">
          Red Dots: <b>{pointsData.length}</b>
        </p>
        <p className="text-blue-200">
          Arcs: <b>{arcsData.length}</b>
        </p>
        <p className="text-gray-300 text-xs mt-2">
          💡 Data persists across page refreshes
        </p>
        <p className="text-gray-400 text-xs">
          Click "Load DB" to load recent attacks
        </p>
      </div>
    </div>
  );
}