import React from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHome } from "@/components/DashboardHome";
import { DevicesPage } from "@/components/DevicesPage";
import { SolarPage } from "@/components/SolarPage";
import { AnalyticsPage } from "@/components/AnalyticsPage";
import { NotificationsPage } from "@/components/NotificationsPage";
import { SettingsPage } from "@/components/SettingsPage";
import { EnergySellPage } from "@/components/EnergySellPage";

const Dashboard = () => {
  return (
    <div className="flex bg-gray-100 h-screen">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/devices" element={<DevicesPage />} />
          <Route path="/solar" element={<SolarPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/sell" element={<EnergySellPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
