
import React, { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAppointments } from "@/hooks/useAppointments";
import { AppointmentTab } from "@/types/appointment.types";
import AppointmentControls from "@/components/appointments/AppointmentControls";
import EmptyAppointmentsState from "@/components/appointments/EmptyAppointmentsState";
import AppointmentGrid from "@/components/appointments/AppointmentGrid";
import { CreateAppointmentDialog } from "@/components/appointments/CreateAppointmentDialog";

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
  const isBusinessAccount = userRole === "business";

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

  // Define available tabs based on user role
  const getAvailableTabs = () => {
    const tabs: AppointmentTab[] = ["my-appointments", "shared-appointments", "invitations"];
    
    if (isBusinessAccount) {
      tabs.push("team-appointments");
    }
    
    return tabs;
  };

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
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">
            Schedule and manage your appointments.
          </p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="flex items-center">
              <Loader2 className="h-8 w-8 animate-spin text-wakti-blue mr-2" />
              <span>{loadingMessage}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">
          Schedule and manage your appointments.
        </p>
      </div>
      
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
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        {filteredAppointments.length > 0 ? (
          <AppointmentGrid 
            appointments={filteredAppointments} 
            userRole={userRole} 
            tab={activeTab}
          />
        ) : (
          <EmptyAppointmentsState 
            isPaidAccount={isPaidAccount} 
            onCreateAppointment={() => setCreateDialogOpen(true)} 
            tab={activeTab}
          />
        )}
      </div>
      
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
