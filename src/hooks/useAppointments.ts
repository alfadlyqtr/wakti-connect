
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { 
  fetchAppointments, 
  createAppointment as createAppointmentService,
  Appointment,
  AppointmentTab,
  AppointmentFormData,
  MonthlyUsage
} from "@/services/appointment";
import { filterAppointments } from "@/utils/appointmentUtils";
import { RecurringFormData } from "@/types/recurring.types";

export type { Appointment, AppointmentTab, AppointmentFormData } from "@/services/appointment";

export const useAppointments = (tab: AppointmentTab = "my-appointments") => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [localUserRole, setLocalUserRole] = useState<"free" | "individual" | "business">("free");
  const [monthlyUsage, setMonthlyUsage] = useState<MonthlyUsage | null>(null);

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
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
    staleTime: 30 * 1000,  // Consider data stale after 30 seconds
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
    
    // Update monthly usage data
    if (data?.monthlyUsage) {
      setMonthlyUsage(data.monthlyUsage);
    }
  }, [data?.userRole, data?.monthlyUsage]);

  // Auto-retry in case of an error - but only once
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
      
      if (!appointmentData.start_time || !appointmentData.end_time) {
        throw new Error("Appointment must have start and end times");
      }
      
      const result = await createAppointmentService(appointmentData as AppointmentFormData, recurringData);
      
      toast({
        title: recurringData ? "Recurring Appointment Created" : "Appointment Created",
        description: "Your appointment has been created successfully",
      });

      console.log("Appointment created successfully:", result);
      
      // Refetch with a delay to ensure the database has time to update
      setTimeout(() => {
        refetch();
      }, 500);
      
      return result;
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      
      // Don't toast here as the service already does
      throw error;
    }
  };

  // Filter appointments based on search and filters
  const getFilteredAppointments = () => {
    const appointmentList = data?.appointments || [];
    return filterAppointments(appointmentList, searchQuery, filterStatus, filterDate);
  };

  // Get the actual user role from data, with a fallback to the state
  const userRole = data?.userRole || localUserRole;

  // Calculate if the user has reached their monthly limit (for free accounts)
  const hasReachedMonthlyLimit = (): boolean => {
    if (userRole !== 'free' || !monthlyUsage) {
      return false;
    }
    
    return monthlyUsage.appointments_created >= 1;
  };

  return {
    appointments: data?.appointments || [],
    userRole: userRole,
    filteredAppointments: getFilteredAppointments(),
    monthlyUsage,
    hasReachedMonthlyLimit: hasReachedMonthlyLimit(),
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
