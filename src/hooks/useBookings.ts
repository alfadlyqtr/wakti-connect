
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { 
  fetchBookings, 
  createBooking as createBookingService,
  Booking,
  BookingTab,
  BookingFormData
} from "@/services/booking";

export const useBookings = (tab: BookingTab = "all-bookings") => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [localUserRole, setLocalUserRole] = useState<"business">("business");

  // Fetch bookings with React Query
  const { 
    data, 
    isLoading, 
    error, 
    refetch,
    isError
  } = useQuery({
    queryKey: ['bookings', tab],
    queryFn: () => fetchBookings(tab),
    refetchOnWindowFocus: true,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
    staleTime: 30 * 1000,
    meta: {
      onError: (err: any) => {
        console.error("Booking fetch error:", err);
        toast({
          title: "Failed to load bookings",
          description: err.message || "An unexpected error occurred",
          variant: "destructive",
        });
      }
    }
  });

  // Auto-retry in case of an error - but only once
  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        console.log("Auto-retrying booking fetch after error");
        refetch();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isError, refetch]);

  // Create a new booking
  const createBooking = async (bookingData: Partial<BookingFormData>) => {
    try {
      if (!bookingData.title) {
        throw new Error("Booking title is required");
      }
      
      if (!bookingData.start_time || !bookingData.end_time) {
        throw new Error("Booking must have start and end times");
      }
      
      const result = await createBookingService(bookingData as BookingFormData);
      
      toast({
        title: "Booking Created",
        description: "Your booking has been created successfully",
      });

      // Refetch with a delay to ensure the database has time to update
      setTimeout(() => {
        refetch();
      }, 500);
      
      return result;
    } catch (error: any) {
      console.error("Error creating booking:", error);
      
      toast({
        title: "Failed to create booking",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  // Filter bookings based on search and filters
  const getFilteredBookings = () => {
    const bookingsList = data?.bookings || [];
    return bookingsList.filter((booking) => {
      // Search filter
      const matchesSearch = searchQuery 
        ? booking.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (booking.description && booking.description.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      
      // Status filter
      const matchesStatus = filterStatus === "all" ? true : booking.status === filterStatus;
      
      // Date filter
      const matchesDate = !filterDate ? true : new Date(booking.start_time).toDateString() === filterDate.toDateString();
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  };

  return {
    bookings: data?.bookings || [],
    filteredBookings: getFilteredBookings(),
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterDate,
    setFilterDate,
    createBooking,
    refetch
  };
};
