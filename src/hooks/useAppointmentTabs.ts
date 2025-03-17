
import { useCallback } from "react";
import { UserRole } from "./useAppointments";

export type AppointmentTab = "my-appointments" | "shared-appointments" | "assigned-appointments" | "team-appointments" | "upcoming" | "past" | "invitations";

export const useAppointmentTabs = (userRole: string = "free") => {
  // Appointment system has been deprecated
  
  const getAvailableTabs = useCallback((): AppointmentTab[] => {
    console.warn("The appointments system has been deprecated");
    return ["my-appointments"];
  }, []);
  
  // Added isBusinessAccount calculation based on userRole
  const isBusinessAccount = userRole === "business";
  
  return { getAvailableTabs, isBusinessAccount };
};
