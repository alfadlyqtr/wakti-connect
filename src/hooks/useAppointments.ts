
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export interface Appointment {
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

export const useAppointments = () => {
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

  const createAppointment = async () => {
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

  // Filter appointments based on search
  const getFilteredAppointments = () => {
    const appointments = appointmentsData?.appointments || [];
    
    return appointments.filter((appointment) => {
      return searchQuery 
        ? appointment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (appointment.description && appointment.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (appointment.location && appointment.location.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
    });
  };

  return {
    appointmentsData,
    filteredAppointments: getFilteredAppointments(),
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    createAppointment,
    refetch
  };
};
