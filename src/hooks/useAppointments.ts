
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
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
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
      // Also update localStorage for future use
      localStorage.setItem('userRole', data.userRole);
    }
  }, [data?.userRole]);

  // Auto-retry in case of an error
  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        console.log("Auto-retrying appointment fetch after error");
        refetch();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isError, refetch]);

  // Create a new appointment
  const createAppointment = async (appointmentData: Partial<AppointmentFormData>, recurringData?: RecurringFormData) => {
    try {
      const result = await createAppointmentService(appointmentData as AppointmentFormData, recurringData);
      
      toast({
        title: recurringData ? "Recurring Appointment Created" : "Appointment Created",
        description: recurringData 
          ? "New recurring appointment has been created successfully" 
          : "New appointment has been created successfully",
      });

      // Refetch appointments to update the list
      refetch();
      
      return result;
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      
      // Display more detailed error information
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
    return filterAppointments(appointmentList, searchQuery, filterStatus, filterDate);
  };

  // Get the actual user role from data, with a fallback to the state
  const userRole = data?.userRole || localUserRole;
  
  // Log the user role to help with debugging
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
