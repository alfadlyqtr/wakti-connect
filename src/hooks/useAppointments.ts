
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { 
  fetchAppointments, 
  createAppointment as createAppointmentService,
  Appointment,
  AppointmentTab,
  AppointmentFormData
} from "@/services/appointment";
import { filterAppointments } from "@/utils/appointmentUtils";
import { RecurringFormData } from "@/types/recurring.types";

export type { Appointment, AppointmentTab, AppointmentFormData } from "@/services/appointment";

export const useAppointments = (tab: AppointmentTab = "my-appointments") => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [localUserRole, setLocalUserRole] = useState<"free" | "individual" | "business">("free");

  // Initialize user role from localStorage if available
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as "free" | "individual" | "business" | null;
    if (storedRole) {
      setLocalUserRole(storedRole);
    }
  }, []);

  // Fetch appointments with React Query
  const { 
    data, 
    isLoading, 
    error, 
    refetch,
    isError
  } = useQuery({
    queryKey: ['appointments', tab],
    queryFn: () => fetchAppointments(tab),
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
    staleTime: 5 * 1000,  // Consider data stale after 5 seconds
    refetchInterval: 20 * 1000, // Refetch every 20 seconds
    meta: {
      onError: (err: any) => {
        console.error("Appointment fetch error:", err);
        toast({
          title: "Failed to load appointments",
          description: err.message || "An unexpected error occurred",
          variant: "destructive",
        });
      }
    }
  });

  // Update local user role when data changes
  useEffect(() => {
    if (data?.userRole) {
      setLocalUserRole(data.userRole);
      localStorage.setItem('userRole', data.userRole);
    }
  }, [data?.userRole]);

  // Auto-retry in case of an error
  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        console.log("Auto-retrying appointment fetch after error");
        refetch();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isError, refetch]);

  // Create a new appointment with enhanced error handling
  const createAppointment = async (appointmentData: Partial<AppointmentFormData>, recurringData?: RecurringFormData) => {
    try {
      console.log("Creating appointment in useAppointments hook:", appointmentData);
      
      if (!appointmentData.title) {
        throw new Error("Appointment title is required");
      }
      
      if (!appointmentData.start_time && !appointmentData.end_time) {
        throw new Error("Appointment must have start and end times");
      }
      
      const result = await createAppointmentService(appointmentData as AppointmentFormData, recurringData);
      
      toast({
        title: recurringData ? "Recurring Appointment Created" : "Appointment Created",
        description: "Your appointment has been created successfully",
      });

      console.log("Appointment created successfully:", result);

      // Multiple refetches to ensure data is updated
      refetch();
      
      setTimeout(() => {
        console.log("Secondary refetch to ensure data is up-to-date");
        refetch();
      }, 500);
      
      setTimeout(() => {
        console.log("Final refetch to ensure data is up-to-date");
        refetch();
      }, 1500);
      
      return result;
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      
      toast({
        title: "Failed to create appointment",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  // Filter appointments based on search and filters
  const getFilteredAppointments = () => {
    const appointmentList = data?.appointments || [];
    console.log(`Filtering ${appointmentList.length} appointments with search: "${searchQuery}"`);
    
    if (appointmentList.length > 0) {
      console.log("Sample appointment data:", {
        id: appointmentList[0].id,
        title: appointmentList[0].title,
        user_id: appointmentList[0].user_id,
        start_time: appointmentList[0].start_time
      });
    }
    
    return filterAppointments(appointmentList, searchQuery, filterStatus, filterDate);
  };

  // Get the actual user role from data, with a fallback to the state
  const userRole = data?.userRole || localUserRole;
  
  console.log("useAppointments hook - user role:", userRole);
  console.log("useAppointments hook - appointments count:", data?.appointments?.length || 0);

  return {
    appointments: data?.appointments || [],
    userRole: userRole,
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
