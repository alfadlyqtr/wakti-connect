
import { useState } from "react";
import { MonthlyUsage } from "@/services/appointment";

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
  is_recurring_instance?: boolean;
  parent_recurring_id?: string | null;
}

export interface AppointmentFormData {
  title: string;
  description?: string;
  location?: string;
  start_time?: string;
  end_time?: string;
  is_all_day?: boolean;
  appointment_type?: string;
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
    createAppointment: async (appointmentData: any) => {
      console.warn("The appointments system has been deprecated");
      return null;
    },
    refetch: () => {},
    hasReachedMonthlyLimit: false,
    monthlyUsage: {
      appointments_created: 0,
      events_created: 0,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    }
  };
};
