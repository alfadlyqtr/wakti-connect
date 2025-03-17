
import { useCallback } from "react";

export type AppointmentTab = "my-appointments" | "shared-appointments" | "assigned-appointments" | "team-appointments" | "upcoming" | "past" | "invitations";

export const useAppointmentTabs = () => {
  // Appointment system has been deprecated
  
  const getAvailableTabs = useCallback((): AppointmentTab[] => {
    console.warn("The appointments system has been deprecated");
    return [];
  }, []);
  
  return { getAvailableTabs, isBusinessAccount: false };
};
