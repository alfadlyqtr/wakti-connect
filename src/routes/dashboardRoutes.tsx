
import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import DashboardTasks from "@/pages/dashboard/DashboardTasks";
import DashboardAppointments from "@/pages/dashboard/DashboardAppointments";
import DashboardMessages from "@/pages/dashboard/DashboardMessages";
import DashboardNotifications from "@/pages/dashboard/DashboardNotifications";
import DashboardContacts from "@/pages/dashboard/DashboardContacts";
import DashboardSettings from "@/pages/dashboard/DashboardSettings";
import DashboardStaffManagement from "@/pages/dashboard/DashboardStaffManagement";
import DashboardWorkLogs from "@/pages/dashboard/DashboardWorkLogs";
import DashboardServiceManagement from "@/pages/dashboard/DashboardServiceManagement";
import DashboardBusinessReports from "@/pages/dashboard/DashboardBusinessReports";
import DashboardBusinessAnalytics from "@/pages/dashboard/DashboardBusinessAnalytics";
import DashboardBilling from "@/pages/dashboard/DashboardBilling";
import DashboardUpgrade from "@/pages/dashboard/DashboardUpgrade";
import DashboardPaymentConfirmation from "@/pages/dashboard/DashboardPaymentConfirmation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const DashboardRoutes = () => {
  return (
    <Routes>
      {/* General dashboard route */}
      <Route 
        index
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardHome />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Account type specific dashboard routes */}
      <Route 
        path="/free" 
        element={
          <ProtectedRoute>
            <DashboardLayout userRole="free">
              <DashboardHome />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/individual" 
        element={
          <ProtectedRoute>
            <DashboardLayout userRole="individual">
              <DashboardHome />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/business" 
        element={
          <ProtectedRoute>
            <DashboardLayout userRole="business">
              <DashboardHome />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Feature specific routes */}
      <Route 
        path="/tasks" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardTasks />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/appointments" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardAppointments />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/messages" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardMessages />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/notifications" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardNotifications />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/contacts" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardContacts />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardSettings />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Business-specific routes */}
      <Route 
        path="/staff" 
        element={
          <ProtectedRoute>
            <DashboardLayout userRole="business">
              <DashboardStaffManagement />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/work-logs" 
        element={
          <ProtectedRoute>
            <DashboardLayout userRole="business">
              <DashboardWorkLogs />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/services" 
        element={
          <ProtectedRoute>
            <DashboardLayout userRole="business">
              <DashboardServiceManagement />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute>
            <DashboardLayout userRole="business">
              <DashboardBusinessReports />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            <DashboardLayout userRole="business">
              <DashboardBusinessAnalytics />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Billing & Subscription routes */}
      <Route 
        path="/billing" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardBilling />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/upgrade" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardUpgrade />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/payment-confirmation" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPaymentConfirmation />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default DashboardRoutes;
