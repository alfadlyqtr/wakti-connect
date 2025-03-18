
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { fetchBookings, createBooking, BookingTab, BookingStatus, BookingFormData } from "@/services/booking";

// Hook for handling booking operations
export const useBookings = (activeTab: BookingTab = "all-bookings") => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<BookingStatus | "all">("all");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);

  // Fetch bookings based on the selected tab
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["bookings", activeTab],
    queryFn: async () => {
      console.log("Fetching bookings for tab:", activeTab);
      
      // Check user session first
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("Auth session exists:", !!sessionData.session, "User ID:", sessionData.session?.user?.id);
      
      if (!sessionData?.session?.user) {
        console.error("Not authenticated when fetching bookings");
        return { bookings: [], userRole: "individual" as const };
      }
      
      return fetchBookings(activeTab);
    }
  });

  const bookings = data?.bookings || [];
  console.log("Fetched bookings count:", bookings.length);

  // Create a new booking
  const handleCreateBooking = async (formData: BookingFormData) => {
    try {
      console.log("Creating booking with data:", formData);
      const booking = await createBooking(formData);
      toast({
        title: "Booking Created",
        description: "The booking has been created successfully.",
      });
      refetch();
      return booking;
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast({
        title: "Failed to Create Booking",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Filter bookings based on search query, status and date
  const filteredBookings = bookings.filter(booking => {
    // Filter by search query (title, description, customer name/email)
    const matchesSearch = !searchQuery || 
      booking.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.description && booking.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (booking.customer_name && booking.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (booking.customer_email && booking.customer_email.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by status
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    
    // Filter by date
    const matchesDate = !filterDate || 
      (new Date(booking.start_time).toDateString() === filterDate.toDateString());
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  console.log("Filtered bookings count:", filteredBookings.length);

  return {
    bookings,
    filteredBookings,
    userRole: data?.userRole || "individual",
    isLoading,
    error,
    refetch,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterDate,
    setFilterDate,
    createBooking: handleCreateBooking
  };
};
