
import React, { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAppointments } from "@/hooks/useAppointments";
import { AppointmentTab } from "@/types/appointment.types";
import AppointmentControls from "@/components/appointments/AppointmentControls";
import EmptyAppointmentsState from "@/components/appointments/EmptyAppointmentsState";
import AppointmentGrid from "@/components/appointments/AppointmentGrid";
import { CreateAppointmentDialog } from "@/components/appointments/CreateAppointmentDialog";
import { supabase } from "@/integrations/supabase/client";

const DashboardAppointments = () => {
  const [activeTab, setActiveTab] = useState<AppointmentTab>("my-appointments");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Loading appointments...");
  const [userId, setUserId] = useState<string | null>(null);
  const [attemptedRefreshes, setAttemptedRefreshes] = useState(0);
  
  // Get the current user's ID for diagnosis
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          setUserId(session.user.id);
          localStorage.setItem('userId', session.user.id);
          console.log("Current user identified:", session.user.id);
        } else {
          console.warn("No authenticated session found");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };
    
    checkAuth();
  }, []);
  
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

  // Explicitly log user role and data for debugging
  console.log("DashboardAppointments - user role:", userRole);
  console.log("DashboardAppointments - userId:", userId);
  console.log("DashboardAppointments - all appointments:", appointments?.length || 0);
  console.log("DashboardAppointments - filtered appointments:", filteredAppointments?.length || 0);

  // Determine if this is a paid account
  const isPaidAccount = userRole === "individual" || userRole === "business";
  const isBusinessAccount = userRole === "business";

  // More aggressive refresh strategy
  const refreshAppointments = useCallback(() => {
    console.log(`Refreshing appointments data (attempt ${attemptedRefreshes + 1})`);
    setLoadingMessage(`Refreshing data (attempt ${attemptedRefreshes + 1})...`);
    refetch();
    setAttemptedRefreshes(prev => prev + 1);
    
    // Add delay to ensure UI shows loading state
    setTimeout(() => {
      if (appointments.length === 0 && attemptedRefreshes < 3) {
        setLoadingMessage(`Still loading... checking database (attempt ${attemptedRefreshes + 1})`);
      }
    }, 1000);
  }, [refetch, appointments.length, attemptedRefreshes]);

  // Force refresh on initial load and periodically
  useEffect(() => {
    // Immediate refresh on mount
    refreshAppointments();
    
    // Set up periodic refreshes
    const timer = setInterval(() => {
      if (appointments.length === 0 && attemptedRefreshes < 5) {
        console.log(`Automatic refresh attempt ${attemptedRefreshes + 1} - no appointments yet`);
        refreshAppointments();
      } else {
        clearInterval(timer);
      }
    }, 2500);
    
    return () => clearInterval(timer);
  }, [refreshAppointments, appointments.length, attemptedRefreshes]);

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
      
      // Immediate refresh after creation
      refreshAppointments();
      
      // Multiple refreshes to ensure we catch updates
      const refreshIntervals = [800, 2000, 4000];
      refreshIntervals.forEach(interval => {
        setTimeout(() => {
          console.log(`Refresh at T+${interval}ms to ensure data is up-to-date`);
          refreshAppointments();
        }, interval);
      });
    } catch (error) {
      console.error("Error in handleCreateAppointment:", error);
      // Toast is already handled in the useAppointments hook
    }
  };

  const handleTabChange = (newTab: AppointmentTab) => {
    setActiveTab(newTab);
    // Reset refresh attempts when changing tabs
    setAttemptedRefreshes(0);
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
            
            {userId && (
              <div className="text-sm text-muted-foreground">
                User ID: {userId.substring(0, 8)}...
              </div>
            )}
            
            {attemptedRefreshes > 2 && (
              <button 
                className="mt-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                onClick={refreshAppointments}
              >
                Retry Manually
              </button>
            )}
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
          <div className="space-y-4">
            <EmptyAppointmentsState 
              isPaidAccount={isPaidAccount} 
              onCreateAppointment={() => setCreateDialogOpen(true)} 
              tab={activeTab}
            />
            {userId && (
              <div className="text-xs text-muted-foreground text-center mt-4">
                User ID: {userId} | Role: {userRole} | Tab: {activeTab}
              </div>
            )}
            
            {attemptedRefreshes > 0 && (
              <div className="text-xs text-muted-foreground text-center">
                Refresh attempts: {attemptedRefreshes}
                <button 
                  className="ml-2 px-2 py-1 rounded text-xs bg-blue-500 text-white hover:bg-blue-600"
                  onClick={refreshAppointments}
                >
                  Refresh Again
                </button>
              </div>
            )}
          </div>
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
