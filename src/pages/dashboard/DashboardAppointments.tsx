
import React, { useState } from "react";
import { Plus, Calendar, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import AppointmentCard from "@/components/ui/AppointmentCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

// Define Appointment type based on our database schema
interface Appointment {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  is_all_day: boolean;
  created_at: string;
  updated_at: string;
}

const DashboardAppointments = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch appointments with React Query
  const { 
    data: appointmentsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      // Fetch user's account type
      const { data: profileData } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', session.user.id)
        .single();
      
      // Fetch appointments
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('start_time', { ascending: true });
        
      if (error) {
        console.error("Error fetching appointments:", error);
        throw error;
      }
        
      return {
        appointments: data as Appointment[],
        userRole: profileData?.account_type || "free"
      };
    },
    refetchOnWindowFocus: false,
  });

  // Show error toast if query fails
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Failed to load appointments",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  }, [error]);

  const userRole = appointmentsData?.userRole || "free";
  const appointments = appointmentsData?.appointments || [];
  const isPaidAccount = userRole === "individual" || userRole === "business";

  // Filter appointments based on search
  const filteredAppointments = appointments.filter((appointment) => {
    return searchQuery 
      ? appointment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (appointment.description && appointment.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (appointment.location && appointment.location.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
  });

  const handleCreateAppointment = async () => {
    if (!isPaidAccount) return;
    
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to create appointments",
          variant: "destructive",
        });
        return;
      }

      // Create a sample appointment (in a real app, this would open a form modal)
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 1);
      startTime.setMinutes(0);
      startTime.setSeconds(0);
      
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);
      
      const newAppointment = {
        user_id: session.user.id,
        title: "New Appointment",
        description: "Click to edit this appointment",
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        location: "Office",
        is_all_day: false
      };

      const { error } = await supabase
        .from('appointments')
        .insert(newAppointment);

      if (error) {
        throw error;
      }

      toast({
        title: "Appointment Created",
        description: "New appointment has been created successfully",
      });

      // Refetch appointments to update the list
      refetch();
    } catch (error: any) {
      toast({
        title: "Failed to create appointment",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
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
      
      {isPaidAccount && (
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search appointments..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button onClick={handleCreateAppointment} className="flex items-center gap-2">
            <Plus size={16} />
            <span className="hidden sm:inline">Schedule Appointment</span>
          </Button>
        </div>
      )}
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        {filteredAppointments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                id={appointment.id}
                title={appointment.title}
                dateTime={new Date(appointment.start_time)}
                location={appointment.location || ""}
                status="confirmed" // This would be dynamic in a real implementation
                userRole={userRole || "free"}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 py-12">
            <Calendar className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No appointments scheduled</h3>
            <p className="text-center text-sm text-muted-foreground max-w-xs">
              {isPaidAccount 
                ? "You haven't scheduled any appointments yet. Create a new appointment to get started."
                : "Free accounts can only view appointments. Upgrade to create and manage appointments."}
            </p>
            {isPaidAccount ? (
              <Button onClick={handleCreateAppointment} className="flex items-center gap-2">
                <Plus size={16} />
                Schedule Appointment
              </Button>
            ) : (
              <div className="text-center">
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 mb-2">
                  View Only
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Upgrade to create and manage appointments
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardAppointments;
