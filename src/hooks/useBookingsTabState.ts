
import { useState } from "react";
import { BookingTab } from "@/types/booking.types";

export const useBookingsTabState = () => {
  const [activeTab, setActiveTab] = useState<BookingTab>("all-bookings");
  
  return {
    activeTab,
    setActiveTab
  };
};
