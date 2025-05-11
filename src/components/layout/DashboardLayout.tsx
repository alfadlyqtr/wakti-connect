
import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

// This component wraps the dashboard content and ensures the dashboard layout
// is applied consistently across all dashboard routes
const DashboardLayoutWrapper = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default DashboardLayoutWrapper;
