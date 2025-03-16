
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
  assignee_id?: string | null;
  created_at: string;
  updated_at: string;
}

export type AppointmentTab = "my-appointments" | "shared-appointments" | "assigned-appointments";

interface AppointmentResult {
  appointments: Appointment[];
  userRole: "free" | "individual" | "business";
}

export const useAppointments = (tab: AppointmentTab = "my-appointments") => {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch appointments with React Query
  const { 
    data: appointmentsData,
    isLoading,
    error,
    refetch
  } = useQuery<AppointmentResult>({
    queryKey: ['appointments', tab],
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
      
      let query;
      
      switch (tab) {
        case "my-appointments":
          // User's own appointments
          query = supabase
            .from('appointments')
            .select('*')
            .eq('user_id', session.user.id)
            .order('start_time', { ascending: true });
          break;
          
        case "shared-appointments":
          // Appointments shared with the user
          query = supabase
            .from('appointment_invitations')
            .select('appointment_id, appointments(*)')
            .eq('invited_user_id', session.user.id)
            .order('created_at', { ascending: false });
          break;
          
        case "assigned-appointments":
          // Appointments assigned to the user (for staff)
          query = supabase
            .from('appointments')
            .select('*')
            .eq('assignee_id', session.user.id)
            .order('start_time', { ascending: true });
          break;
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error(`Error fetching ${tab}:`, error);
        throw error;
      }
      
      // Transform data if needed
      let transformedData;
      if (tab === "shared-appointments") {
        transformedData = data.map((item: any) => item.appointments);
      } else {
        transformedData = data;
      }
        
      return {
        appointments: transformedData as Appointment[],
        userRole: profileData?.account_type || "free"
      };
    },
    refetchOnWindowFocus: false,
  });

  const createAppointment = async (appointmentData: Partial<Appointment>) => {
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

      // Create the appointment
      const startTime = appointmentData.start_time 
        ? new Date(appointmentData.start_time) 
        : new Date();
      
      const endTime = appointmentData.end_time 
        ? new Date(appointmentData.end_time) 
        : new Date(startTime.getTime() + 3600000); // 1 hour later
      
      const newAppointment = {
        user_id: session.user.id,
        title: appointmentData.title || "New Appointment",
        description: appointmentData.description || "",
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        location: appointmentData.location || "",
        is_all_day: appointmentData.is_all_day || false,
        assignee_id: appointmentData.assignee_id || null
      } as any; // Using 'as any' to bypass the type check for now

      const { error, data } = await supabase
        .from('appointments')
        .insert(newAppointment)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Appointment Created",
        description: "New appointment has been created successfully",
      });

      // Refetch appointments to update the list
      refetch();
      
      return data[0];
    } catch (error: any) {
      toast({
        title: "Failed to create appointment",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Share an appointment with another user
  const shareAppointment = async (appointmentId: string, email: string) => {
    try {
      // First check if the email exists in profiles
      const { data: userData } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
      
      const inviteData = {
        appointment_id: appointmentId,
        invited_user_id: userData?.id || null,
        email: email
      };
      
      const { error } = await supabase
        .from('appointment_invitations')
        .insert(inviteData);

      if (error) throw error;

      toast({
        title: "Appointment Shared",
        description: "Appointment invitation has been sent",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Failed to share appointment",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Assign an appointment to a staff member
  const assignAppointment = async (appointmentId: string, staffId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ assignee_id: staffId })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Appointment Assigned",
        description: "Appointment has been assigned successfully",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Failed to assign appointment",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
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
    userRole: appointmentsData?.userRole || "free",
    filteredAppointments: getFilteredAppointments(),
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    createAppointment,
    shareAppointment,
    assignAppointment,
    refetch
  };
};
