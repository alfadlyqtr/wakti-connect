
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAppointments } from "@/hooks/useAppointments";
import { AppointmentTab } from "@/types/appointment.types";
import AppointmentControls from "@/components/appointments/AppointmentControls";
import { CreateAppointmentDialog } from "@/components/appointments/CreateAppointmentDialog";
import AppointmentLoadingState from "@/components/appointments/AppointmentLoadingState";
import AppointmentHeader from "@/components/appointments/AppointmentHeader";
import AppointmentContent from "@/components/appointments/AppointmentContent";
import { useAppointmentTabs } from "@/hooks/useAppointmentTabs";

const DashboardAppointments = () => {
  const [activeTab, setActiveTab] = useState<AppointmentTab>("my-appointments");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Loading appointments...");
  
  // We need to ensure the AppointmentTab from types and services match
  const { 
    filteredAppointments, 
    appointments,
    isLoading, 
    error, 
    searchQuery, 
    setSearchQuery,
    createAppointment,
    userRole,
    refetch
  } = useAppointments(activeTab as any);

  // Determine if this is a paid account
  const isPaidAccount = userRole === "individual" || userRole === "business";
  const { getAvailableTabs, isBusinessAccount } = useAppointmentTabs(userRole);

  // More focused refresh strategy with limited attempts
  const refreshAppointments = useCallback(() => {
    setLoadingMessage(`Loading appointments...`);
    refetch();
  }, [refetch]);

  // Initial load and one retry if needed
  useEffect(() => {
    // Immediate refresh on mount
    refreshAppointments();
    
    // One additional refresh after a short delay
    const timer = setTimeout(() => {
      if (appointments.length === 0) {
        refreshAppointments();
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [refreshAppointments, appointments.length]);

  // Show error toast if query fails
  useEffect(() => {
    if (error) {
      console.error("Error in appointments page:", error);
      toast({
        title: "Failed to load appointments",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      
      // Auto-retry on error, but just once
      const timer = setTimeout(() => {
        refreshAppointments();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [error, refreshAppointments]);

  // Reset to default tab when role changes
  useEffect(() => {
    if (activeTab === "team-appointments" && !isBusinessAccount) {
      setActiveTab("my-appointments");
    }
  }, [userRole, activeTab, isBusinessAccount]);

  const handleCreateAppointment = async (appointmentData: any, recurringData?: any) => {
    try {
      console.log("Creating appointment with data:", appointmentData);
      await createAppointment(appointmentData, recurringData);
      setCreateDialogOpen(false);
      
      // Refresh after creation with appropriate delay
      setTimeout(() => refreshAppointments(), 500);
      setTimeout(() => refreshAppointments(), 2000);
    } catch (error) {
      console.error("Error in handleCreateAppointment:", error);
      // Toast is already handled in the useAppointments hook
    }
  };

  const handleTabChange = (newTab: AppointmentTab) => {
    setActiveTab(newTab);
    // Refresh when changing tabs
    setTimeout(() => refreshAppointments(), 100);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AppointmentHeader />
        <AppointmentLoadingState message={loadingMessage} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AppointmentHeader />
      
      <AppointmentControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateAppointment={() => setCreateDialogOpen(true)}
        isPaidAccount={isPaidAccount}
        currentTab={activeTab}
        onTabChange={handleTabChange}
        userRole={userRole}
        availableTabs={getAvailableTabs()}
      />
      
      <AppointmentContent 
        appointments={filteredAppointments}
        userRole={userRole}
        tab={activeTab}
        onCreateAppointment={() => setCreateDialogOpen(true)}
        isPaidAccount={isPaidAccount}
      />
      
      <CreateAppointmentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateAppointment={handleCreateAppointment}
        userRole={userRole}
      />
    </div>
  );
};

export default DashboardAppointments;
