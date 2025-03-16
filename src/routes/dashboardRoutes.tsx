
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import DashboardTasks from "@/pages/dashboard/DashboardTasks";
import DashboardAppointments from "@/pages/dashboard/DashboardAppointments";
import DashboardMessages from "@/pages/dashboard/DashboardMessages";
import DashboardContacts from "@/pages/dashboard/DashboardContacts";
import DashboardNotifications from "@/pages/dashboard/DashboardNotifications";
import DashboardUpgrade from "@/pages/dashboard/DashboardUpgrade";
import DashboardSettings from "@/pages/dashboard/DashboardSettings";
import DashboardBilling from "@/pages/dashboard/DashboardBilling";
import DashboardPaymentConfirmation from "@/pages/dashboard/DashboardPaymentConfirmation";
import DashboardServiceManagement from "@/pages/dashboard/DashboardServiceManagement";
import DashboardBusinessAnalytics from "@/pages/dashboard/DashboardBusinessAnalytics";
import DashboardBusinessReports from "@/pages/dashboard/DashboardBusinessReports";
import DashboardStaffManagement from "@/pages/dashboard/DashboardStaffManagement";
import DashboardWorkLogs from "@/pages/dashboard/DashboardWorkLogs";
import DashboardJobs from "@/pages/dashboard/DashboardJobs";
import DashboardJobCards from "@/pages/dashboard/DashboardJobCards";
import DashboardProfile from "@/pages/dashboard/DashboardProfile";
import DashboardBusinessPage from "@/pages/dashboard/DashboardBusinessPage";
import DashboardSubscribers from "@/pages/dashboard/DashboardSubscribers";

const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/profile" element={<DashboardProfile />} />
        <Route path="/tasks" element={<DashboardTasks />} />
        <Route path="/appointments" element={<DashboardAppointments />} />
        <Route path="/messages" element={<DashboardMessages />} />
        <Route path="/contacts" element={<DashboardContacts />} />
        <Route path="/notifications" element={<DashboardNotifications />} />
        <Route path="/upgrade" element={<DashboardUpgrade />} />
        <Route path="/settings" element={<DashboardSettings />} />
        <Route path="/billing" element={<DashboardBilling />} />
        <Route path="/payment-confirmation" element={<DashboardPaymentConfirmation />} />
        <Route path="/service-management" element={<DashboardServiceManagement />} />
        <Route path="/analytics" element={<DashboardBusinessAnalytics />} />
        <Route path="/reports" element={<DashboardBusinessReports />} />
        <Route path="/staff" element={<DashboardStaffManagement />} />
        <Route path="/work-logs" element={<DashboardWorkLogs />} />
        <Route path="/jobs" element={<DashboardJobs />} />
        <Route path="/job-cards" element={<DashboardJobCards />} />
        {/* New Business Pages */}
        <Route path="/business-page" element={<DashboardBusinessPage />} />
        <Route path="/subscribers" element={<DashboardSubscribers />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRoutes;
