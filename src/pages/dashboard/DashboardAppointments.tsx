
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
  
  // We need to ensure the AppointmentTab from types and services match
  // Convert the type from types to the one accepted by the service
  const { 
    filteredAppointments, 
    isLoading, 
    error, 
    searchQuery, 
    setSearchQuery,
    createAppointment,
    userRole,
    refetch
  } = useAppointments(activeTab as any); // Using 'any' to bridge the type mismatch temporarily

  // Explicitly log user role for debugging
  console.log("DashboardAppointments - user role:", userRole);
  console.log("DashboardAppointments - filtered appointments:", filteredAppointments?.length || 0);

  // Determine if this is a paid account
  const isPaidAccount = userRole === "individual" || userRole === "business";
  const isBusinessAccount = userRole === "business";
  console.log("DashboardAppointments - isPaidAccount:", isPaidAccount);

  // More aggressive refresh strategy
  const refreshAppointments = useCallback(() => {
    console.log("Refreshing appointments data");
    refetch();
  }, [refetch]);

  // Force refresh on initial load and periodically
  useEffect(() => {
    // Immediate refresh on mount
    refreshAppointments();
    
    // Then set up a timer to refresh every few seconds until we get data
    const timer = setInterval(() => {
      if (filteredAppointments.length === 0) {
        console.log("Automatic refresh - no appointments yet");
        refreshAppointments();
      } else {
        clearInterval(timer);
      }
    }, 3000);
    
    return () => clearInterval(timer);
  }, [refreshAppointments, filteredAppointments.length]);

  // Show error toast if query fails
  useEffect(() => {
    if (error) {
      console.error("Error in appointments page:", error);
      toast({
        title: "Failed to load appointments",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      
      // Auto-retry on error
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
      
      // Immediately refresh after creation
      refreshAppointments();
      
      // And also after a delay to ensure we catch server-side updates
      setTimeout(() => refreshAppointments(), 1000);
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
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
            <span className="ml-2">Loading appointments...</span>
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
