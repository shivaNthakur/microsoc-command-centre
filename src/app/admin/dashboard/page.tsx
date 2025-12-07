"use client";
import React from "react";

import Topbar from "@/components/dashboard_admin/Topbar";
import Sidebar from "@/components/dashboard_admin/Sidebar";
import AdminDashboard from "@/components/dashboard_admin/AdminDashboard";

const page = () => {
  return (
    <>
      <Sidebar />
      <div className="ml-[250px]"> 
        <Topbar />
        <div className="p-6">
          <AdminDashboard />
        </div>
      </div>
    </>
  );
};

export default page;
