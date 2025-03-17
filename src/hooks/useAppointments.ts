
import { useState } from "react";
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

  // Fetch appointments with React Query
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['appointments', tab],
    queryFn: () => fetchAppointments(tab),
    refetchOnWindowFocus: false,
    retry: 1,
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
      
      if (error.message === "This feature is only available for paid accounts") {
        toast({
          title: "Premium Feature",
          description: "Creating appointments is only available for paid accounts",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to create appointment",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  // Filter appointments based on search and filters
  const getFilteredAppointments = () => {
    const appointmentList = data?.appointments || [];
    return filterAppointments(appointmentList, searchQuery, filterStatus, filterDate);
  };

  // Get the actual user role from data, with a fallback
  const userRole = data?.userRole || localStorage.getItem('userRole') as "free" | "individual" | "business" || "free";
  
  // Log the user role to help with debugging
  console.log("useAppointments hook - user role:", userRole);

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
