
import { useState } from "react";

// Appointment system has been deprecated
// This hook is maintained as a placeholder to prevent import errors

export type AppointmentTab = "my-appointments" | "shared-appointments" | "assigned-appointments" | "team-appointments" | "upcoming" | "past" | "invitations";

export interface Appointment {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  status: string;
  user_id: string;
  assignee_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppointmentFormData {
  title: string;
  description?: string;
  location?: string;
  start_time?: string;
  end_time?: string;
  is_all_day?: boolean;
}

export const useAppointments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  console.warn("The appointments system has been deprecated");
  
  return {
    appointments: [],
    filteredAppointments: [],
    userRole: "free" as const,
    isLoading: false,
    error: null,
    searchQuery,
    setSearchQuery,
    filterStatus: "all",
    setFilterStatus: () => {},
    filterDate: null,
    setFilterDate: () => {},
    createAppointment: async () => {
      console.warn("The appointments system has been deprecated");
      return null;
    },
    refetch: () => {},
    hasReachedMonthlyLimit: false
  };
};
