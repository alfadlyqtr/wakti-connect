
import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAppointments } from "@/hooks/useAppointments";
import AppointmentControls from "@/components/appointments/AppointmentControls";
import EmptyAppointmentsState from "@/components/appointments/EmptyAppointmentsState";
import AppointmentGrid from "@/components/appointments/AppointmentGrid";

const DashboardAppointments = () => {
  const { 
    appointmentsData,
    filteredAppointments, 
    isLoading, 
    error, 
    searchQuery, 
    setSearchQuery,
    createAppointment
  } = useAppointments();

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

  const userRole = appointmentsData?.userRole || "free";
  const isPaidAccount = userRole === "individual" || userRole === "business";

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
        onCreateAppointment={createAppointment}
        isPaidAccount={isPaidAccount}
      />
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        {filteredAppointments.length > 0 ? (
          <AppointmentGrid 
            appointments={filteredAppointments} 
            userRole={userRole} 
          />
        ) : (
          <EmptyAppointmentsState 
            isPaidAccount={isPaidAccount} 
            onCreateAppointment={createAppointment} 
          />
        )}
      </div>
    </div>
  );
};

export default DashboardAppointments;
