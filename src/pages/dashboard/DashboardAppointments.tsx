
import React, { useState, useEffect } from "react";
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
  
  const { 
    filteredAppointments, 
    isLoading, 
    error, 
    searchQuery, 
    setSearchQuery,
    createAppointment,
    userRole,
    refetch
  } = useAppointments(activeTab);

  // Explicitly log user role for debugging
  console.log("DashboardAppointments - user role:", userRole);

  // Determine if this is a paid account
  const isPaidAccount = userRole === "individual" || userRole === "business";
  const isBusinessAccount = userRole === "business";
  console.log("DashboardAppointments - isPaidAccount:", isPaidAccount);

  // Show error toast if query fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Failed to load appointments",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  }, [error]);

  // Auto-retry fetching on errors
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        console.log("Auto-retrying appointment fetch after error");
        refetch();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error, refetch]);

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

  const handleCreateAppointment = async (appointmentData: any) => {
    try {
      await createAppointment(appointmentData);
      setCreateDialogOpen(false);
    } catch (error) {
      console.error("Error in handleCreateAppointment:", error);
      // Toast is already handled in the useAppointments hook
    }
  };

  const handleTabChange = (newTab: AppointmentTab) => {
    setActiveTab(newTab);
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
