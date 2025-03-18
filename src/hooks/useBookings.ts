
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Booking, BookingStatus, BookingFormData } from "@/types/booking.types";
import { toast } from "@/components/ui/use-toast";

export const useBookings = (tabFilter: string = "all-bookings") => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<BookingStatus | "all">("all");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const queryClient = useQueryClient();

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
        return data as Booking[];
      } catch (err) {
        console.error("Error fetching bookings:", err);
        throw err;
      }
    }
  });

  // Client-side filtering with proper type casting
  const filteredBookings = bookings?.filter((booking) => {
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

  // Add createBooking function
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: BookingFormData) => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error("Authentication required");
      }
      
      // Add the business_id to the booking data
      const completeBookingData = {
        business_id: session.session.user.id,
        ...bookingData
      };

      const { data, error } = await supabase
        .from("bookings")
        .insert(completeBookingData)
        .select()
        .single();

      if (error) {
        console.error("Error creating booking:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch bookings after mutation
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      
      toast({
        title: "Booking created",
        description: "The booking has been successfully created",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create booking: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  });

  const createBooking = (bookingData: BookingFormData) => {
    return createBookingMutation.mutateAsync(bookingData);
  };

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
    error,
    createBooking
  };
};
