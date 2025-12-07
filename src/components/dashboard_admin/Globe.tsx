"use client"
import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import Navbar from '@/components/NavBar';

export default function InteractiveGlobe({ ipList = [] }) {
  const globeEl = useRef();
  const [pointsData, setPointsData] = useState([]);
  const [arcsData, setArcsData] = useState([]);
  const [autoRotate, setAutoRotate] = useState(true);
  const [speed, setSpeed] = useState(0.8);

  // ---------- Helper: pseudo-random IP → lat/lng
  const mockIpToLatLng = (ip:any) => {
    const seed = ip.split('.').reduce((s:any, x:any) => s + Number(x || 0), 0);
    const lat = ((seed * 37) % 180) - 90;
    const lng = ((seed * 91) % 360) - 180;
    return { lat, lng };
  };

  const sampleData = useMemo(
    () => [
      { ip: "8.8.8.8" },
      { ip: "13.107.21.200" },
      { ip: "52.95.110.1" },
      { ip: "203.112.1.5" },
      { ip: "185.60.216.35" },
      { ip: "139.130.4.5" },
      { ip: "200.89.178.200" }
    ],
    []
  );

  useEffect(() => {
    const input = ipList?.length
      ? ipList.map(x => (typeof x === "string" ? { ip: x } : x))
      : sampleData;

    const coords = input.map((item, i) => {
      const { lat, lng } = mockIpToLatLng(item.ip);
      return {
        id: `${item.ip}-${i}`,
        ip: item.ip,
        lat,
        lng
      };
    });

    setPointsData(coords);

    const arcs = coords.flatMap((c, i) => {
      const target = coords[(i + 1) % coords.length];
      return {
        startLat: c.lat,
        startLng: c.lng,
        endLat: target.lat,
        endLng: target.lng,
        id: `arc-${i}`,
        color: [
          [255, 0, 180, 0.9],
          [0, 180, 255, 0.9]
        ],
        dashLength: 0.5,
        stroke: 1.5 + Math.random() * 1.5
      };
    });

    setArcsData(arcs);
  }, [ipList, sampleData]);

  // ------- CAMERA SHAKE -------
  const cameraShake = () => {
    const controls = globeEl.current.controls();
    const origSpeed = controls.autoRotateSpeed;
    controls.autoRotateSpeed = origSpeed + 0.8;
    setTimeout(() => (controls.autoRotateSpeed = origSpeed), 500);
  };

  // ------- AUTO ROTATE -------
  useEffect(() => {
    if (!globeEl.current) return;
    const controls = globeEl.current.controls();
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = speed;
  }, [autoRotate, speed]);

  return (
    <>
    <Navbar/>
    <div className="w-full min-h-screen relative overflow-hidden bg-[#010413] text-white">
      <div className="absolute inset-0 -z-10 opacity-40 bg-[url('https://i.ibb.co/3Tg4xJ8/stars2.png')] bg-cover animate-pulse"></div>

      <Globe
        ref={globeEl}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"

        // ---- TARGET RED DOTS ----
        pointsData={pointsData}
        pointLat={(d) => d.lat}
        pointLng={(d) => d.lng}
        pointRadius={() => 0.18}
        pointAltitude={() => 0.01}
        pointColor={() => "red"}

        // ---- ARCS ----
        arcsData={arcsData}
        arcStartLat={(d) => d.startLat}
        arcStartLng={(d) => d.startLng}
        arcEndLat={(d) => d.endLat}
        arcEndLng={(d) => d.endLng}
        arcColor={(d) => d.color}
        arcDashLength={(d) => d.dashLength}
        arcDashGap={1}
        arcDashAnimateTime={1500}
        arcAltitude={0.25}
        arcStroke={(d) => d.stroke}

        // ATMOSPHERE
        showAtmosphere
        atmosphereColor="rgba(120, 0, 255, 0.4)"
        atmosphereAltitude={0.25}

        onPointClick={cameraShake}
        onArcClick={cameraShake}
      />

      {/* INFO CARD */}
      <div className="absolute left-6 bottom-6 p-4 bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/40 w-72 z-20">
        <h2 className="font-bold text-purple-300 mb-1">Detected Targets</h2>
        <p className="text-purple-200">
          Red Dots: <b>{pointsData.length}</b>
        </p>
        <p className="text-gray-300 mt-1">Each red dot marks a detected IP location.</p>
      </div>

    </div>
    </>
  );
}
