
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
    </Routes>
  );
};

export default DashboardRoutes;
