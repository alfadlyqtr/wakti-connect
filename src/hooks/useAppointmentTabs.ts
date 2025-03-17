
import { useCallback } from "react";
import { AppointmentTab } from "@/types/appointment.types";

export const useAppointmentTabs = (userRole: "free" | "individual" | "business") => {
  const isBusinessAccount = userRole === "business";
  
  const getAvailableTabs = useCallback((): AppointmentTab[] => {
    const tabs: AppointmentTab[] = ["my-appointments", "shared-appointments", "invitations"];
    
    if (isBusinessAccount) {
      tabs.push("team-appointments");
    }
    
    return tabs;
  }, [isBusinessAccount]);
  
  return { getAvailableTabs, isBusinessAccount };
};
