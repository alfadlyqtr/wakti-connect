
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { 
  fetchBookings, 
  createBooking as createBookingService,
  updateBookingStatus,
  acknowledgeBooking,
  markBookingNoShow,
  approveNoShow,
  rejectNoShow,
  BookingTab,
  BookingFormData,
  BookingWithRelations,
  BookingStatus
} from "@/services/booking";
import { useEffect } from "react";

export const useBookings = (tab: BookingTab = "all-bookings") => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [filterStaff, setFilterStaff] = useState<string>("all");

  // Fetch bookings with React Query
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['bookings', tab],
    queryFn: () => fetchBookings(tab),
    refetchOnWindowFocus: true,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
    staleTime: 30 * 1000, // 30 seconds
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

  // Function to check if a time slot is already booked
  const isTimeSlotBooked = (startTime: string, endTime: string, staffId?: string): boolean => {
    const bookingsList = data?.bookings || [];
    
    // Skip for template bookings
    if (tab === "templates") return false;
    
    // Convert input times to Date objects for comparison
    const newStartTime = new Date(startTime);
    const newEndTime = new Date(endTime);
    
    // Check for conflicts with existing bookings
    return bookingsList.some(booking => {
      // Skip no-show or cancelled bookings
      if (booking.status === 'no_show' || booking.status === 'cancelled') {
        return false;
      }
      
      // If filtering by staff and staff IDs are provided, only check conflicts for that staff
      if (staffId && booking.staff_assigned_id && staffId !== booking.staff_assigned_id) {
        return false;
      }
      
      const existingStart = new Date(booking.start_time);
      const existingEnd = new Date(booking.end_time);
      
      // Check for time slot overlap
      return (
        (newStartTime >= existingStart && newStartTime < existingEnd) || // New booking starts during existing booking
        (newEndTime > existingStart && newEndTime <= existingEnd) || // New booking ends during existing booking
        (newStartTime <= existingStart && newEndTime >= existingEnd) // New booking completely covers existing booking
      );
    });
  };

  // Create a new booking
  const createBooking = async (bookingData: Partial<BookingFormData>) => {
    try {
      if (!bookingData.title) {
        throw new Error("Booking title is required");
      }
      
      if (!bookingData.start_time || !bookingData.end_time) {
        throw new Error("Booking must have start and end times");
      }
      
      // Check if the time slot is already booked
      if (isTimeSlotBooked(bookingData.start_time, bookingData.end_time, bookingData.staff_assigned_id)) {
        throw new Error("This time slot is already booked. Please select another time.");
      }
      
      const result = await createBookingService(bookingData as BookingFormData);
      
      toast({
        title: "Booking Created",
        description: "Your booking has been created successfully",
      });

      // Force immediate refetch to show the new booking
      refetch();
      
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

  // Update booking status
  const updateStatus = useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string, status: BookingStatus }) => 
      updateBookingStatus(bookingId, status),
    onSuccess: () => {
      toast({
        title: "Booking Updated",
        description: "Booking status has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  // Acknowledge booking
  const acknowledgeBookingMutation = useMutation({
    mutationFn: (bookingId: string) => acknowledgeBooking(bookingId),
    onSuccess: () => {
      toast({
        title: "Booking Acknowledged",
        description: "The booking has been acknowledged and added to your calendar",
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      toast({
        title: "Acknowledgement Failed",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  // Mark booking as no-show
  const markNoShowMutation = useMutation({
    mutationFn: (bookingId: string) => markBookingNoShow(bookingId),
    onSuccess: () => {
      toast({
        title: "No-Show Reported",
        description: "The booking has been marked as a no-show and is pending business approval",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      toast({
        title: "No-Show Report Failed",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  // Approve no-show (business owner only)
  const approveNoShowMutation = useMutation({
    mutationFn: (bookingId: string) => approveNoShow(bookingId),
    onSuccess: () => {
      toast({
        title: "No-Show Approved",
        description: "The no-show has been approved and booking status updated",
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      toast({
        title: "Approval Failed",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  // Reject no-show (business owner only)
  const rejectNoShowMutation = useMutation({
    mutationFn: (bookingId: string) => rejectNoShow(bookingId),
    onSuccess: () => {
      toast({
        title: "No-Show Rejected",
        description: "The no-show report has been rejected",
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      toast({
        title: "Rejection Failed",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

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
      
      // Staff filter
      const matchesStaff = filterStaff === "all" ? true : 
        (booking.staff?.name?.toLowerCase() === filterStaff.toLowerCase() || 
         booking.staff_name?.toLowerCase() === filterStaff.toLowerCase());
      
      return matchesSearch && matchesStatus && matchesDate && matchesStaff;
    });
  };

  // Filter for no-show bookings (either pending approval or approved)
  const getNoShowBookings = () => {
    const bookingsList = data?.bookings || [];
    
    return bookingsList.filter((booking) => {
      return booking.is_no_show === true || booking.status === 'no_show';
    });
  };

  return {
    bookings: data?.bookings || [],
    filteredBookings: getFilteredBookings(),
    noShowBookings: getNoShowBookings(),
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterDate,
    setFilterDate,
    filterStaff,
    setFilterStaff,
    createBooking,
    updateStatus,
    acknowledgeBooking: acknowledgeBookingMutation,
    markNoShow: markNoShowMutation,
    approveNoShow: approveNoShowMutation,
    rejectNoShow: rejectNoShowMutation,
    isTimeSlotBooked,
    refetch
  };
};
