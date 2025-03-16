
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

// Define explicit interface to avoid deep type instantiation
export interface Appointment {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  is_all_day: boolean;
  status: "upcoming" | "completed" | "cancelled";
  user_id: string;
  assignee_id?: string | null;
  created_at: string;
  updated_at: string;
}

export type AppointmentTab = "my-appointments" | "shared-appointments" | "assigned-appointments";

interface AppointmentsResult {
  appointments: Appointment[];
  userRole: "free" | "individual" | "business";
}

export const useAppointments = (tab: AppointmentTab = "my-appointments") => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  // Fetch appointments with React Query
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<AppointmentsResult>({
    queryKey: ['appointments', tab],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      // Get user profile to check account type
      const { data: profileData } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', session.user.id)
        .single();
      
      const userRole = profileData?.account_type || "free";
      
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
            .from('shared_appointments')
            .select('appointment_id, appointments(*)')
            .eq('shared_with', session.user.id)
            .order('created_at', { ascending: false });
          break;
          
        case "assigned-appointments":
          // Appointments assigned to the user (for staff members)
          query = supabase
            .from('appointments')
            .select('*')
            .eq('assignee_id', session.user.id)
            .order('start_time', { ascending: true });
          break;
      }
      
      const { data: appointmentsData, error } = await query;
      
      if (error) {
        console.error(`Error fetching ${tab}:`, error);
        throw error;
      }
      
      // Transform shared appointments data if needed
      let transformedData;
      if (tab === "shared-appointments") {
        transformedData = appointmentsData.map((item: any) => item.appointments);
      } else {
        transformedData = appointmentsData;
      }
      
      return { 
        appointments: transformedData as Appointment[],
        userRole
      };
    },
    refetchOnWindowFocus: false,
  });

  // Create a new appointment
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

      const newAppointment = {
        user_id: session.user.id,
        title: appointmentData.title || "New Appointment",
        description: appointmentData.description || "",
        start_time: appointmentData.start_time || new Date().toISOString(),
        end_time: appointmentData.end_time || new Date(Date.now() + 3600000).toISOString(), // 1 hour later
        location: appointmentData.location || null,
        is_all_day: appointmentData.is_all_day || false,
        status: appointmentData.status || "upcoming",
        assignee_id: appointmentData.assignee_id || null
      };

      const { data, error } = await supabase
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

  // Filter appointments based on search and filters
  const getFilteredAppointments = () => {
    const appointmentList = data?.appointments || [];
    
    return appointmentList.filter((appointment) => {
      // Search filter
      const matchesSearch = searchQuery 
        ? appointment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (appointment.description && appointment.description.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      
      // Status filter
      const matchesStatus = filterStatus === "all" ? true : appointment.status === filterStatus;
      
      // Date filter
      const matchesDate = !filterDate ? true : new Date(appointment.start_time).toDateString() === filterDate.toDateString();
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  };

  return {
    appointments: data?.appointments || [],
    userRole: data?.userRole || "free",
    filteredAppointments: getFilteredAppointments(),
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterDate,
    setFilterDate,
    createAppointment,
    refetch
  };
};
