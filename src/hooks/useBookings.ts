
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Booking, BookingStatus } from "@/types/booking.types";

export const useBookings = (tabFilter: string = "all-bookings") => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<BookingStatus | "all">("all");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);

  const {
    data: bookings,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['bookings', tabFilter],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          throw new Error("Authentication required");
        }

        let query = supabase
          .from('bookings')
          .select(`
            *,
            business_services:service_id (name, price, duration),
            business_staff:staff_assigned_id (name)
          `)
          .eq('business_id', session.user.id);

        // Apply tab filtering
        if (tabFilter === "pending-bookings") {
          query = query.eq('status', 'pending');
        } else if (tabFilter === "staff-bookings") {
          query = query.not('staff_assigned_id', 'is', null);
        }

        const { data, error } = await query;

        if (error) throw error;

        console.log("Bookings fetched:", data);
        return data || [];
      } catch (err) {
        console.error("Error fetching bookings:", err);
        throw err;
      }
    }
  });

  // Client-side filtering
  const filteredBookings = bookings?.filter((booking: Booking) => {
    // Filter by search query
    const matchesSearch = searchQuery
      ? booking.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.customer_email?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    // Filter by status
    const matchesStatus = filterStatus === "all" ? true : booking.status === filterStatus;

    // Filter by date
    const matchesDate = filterDate
      ? new Date(booking.start_time).toDateString() === filterDate.toDateString()
      : true;

    return matchesSearch && matchesStatus && matchesDate;
  });

  return {
    bookings,
    filteredBookings: filteredBookings || [],
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterDate,
    setFilterDate,
    refetch,
    isLoading,
    error
  };
};
