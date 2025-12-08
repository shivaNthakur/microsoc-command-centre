"use client";
import DynamicGlobe from '@/components/dashboard_admin/Globe';

export default function HomePage() {
  return (
    <div className="w-screen min-h-screen overflow-hidden bg-black relative">
      <DynamicGlobe />
    </div>
  );
}