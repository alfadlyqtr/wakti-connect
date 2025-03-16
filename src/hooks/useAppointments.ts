
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { fetchAppointments, createAppointment as createAppointmentService } from "@/services/appointmentService";
import { filterAppointments } from "@/utils/appointmentUtils";
import { Appointment, AppointmentTab, AppointmentFormData } from "@/types/appointment.types";

export type { Appointment, AppointmentTab, AppointmentFormData } from "@/types/appointment.types";

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
  });

  // Create a new appointment
  const createAppointment = async (appointmentData: Partial<AppointmentFormData>) => {
    try {
      const result = await createAppointmentService(appointmentData as AppointmentFormData);
      
      toast({
        title: "Appointment Created",
        description: "New appointment has been created successfully",
      });

      // Refetch appointments to update the list
      refetch();
      
      return result;
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
    return filterAppointments(appointmentList, searchQuery, filterStatus, filterDate);
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
