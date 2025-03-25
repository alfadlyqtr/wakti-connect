
import React from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { BookingTab, BookingStatus } from "@/types/booking.types";
import { useBookings } from "@/hooks/useBookings";
import { useBookingsTabState } from "@/hooks/useBookingsTabState";

// Import refactored components
import BookingsHeader from "@/components/bookings/BookingsHeader";
import BookingsTabContent from "@/components/bookings/BookingsTabContent";
import BookingsError from "@/components/bookings/BookingsError";

const DashboardBookings = () => {
  const { activeTab, setActiveTab } = useBookingsTabState();
  const queryClient = useQueryClient();
  
  // Fetch bookings based on the selected tab
  const { 
    bookings, 
    isLoading, 
    error, 
    refetch 
  } = useBookings(activeTab);

  // Mutation to update booking status
  const updateBookingMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string, status: BookingStatus }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId);
        
      if (error) throw error;
      
      return { bookingId, status };
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      
      // Send notification to customer
      sendStatusNotification(data.bookingId, data.status);
      
      toast({
        title: `Booking ${data.status}`,
        description: `The booking has been ${data.status}.`,
        variant: "success"
      });
    },
    onError: (error) => {
      console.error("Error updating booking:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the booking status.",
        variant: "destructive"
      });
    }
  });
  
  // Send notification to customer when booking status changes
  const sendStatusNotification = async (bookingId: string, status: BookingStatus) => {
    try {
      // Get booking details
      const { data: booking } = await supabase
        .from('bookings')
        .select('customer_id, customer_name, title')
        .eq('id', bookingId)
        .single();
        
      if (booking?.customer_id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: booking.customer_id,
            title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            content: `Your booking for "${booking.title}" has been ${status}.`,
            type: "booking_update",
            related_entity_id: bookingId,
            related_entity_type: "booking"
          });
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <BookingsError error={error} queryClient={queryClient} />;
  }

  return (
    <div className="container py-8">
      <BookingsHeader setActiveTab={setActiveTab} />
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BookingTab)}>
        <TabsList className="mb-6">
          <TabsTrigger value="all-bookings">All Bookings</TabsTrigger>
          <TabsTrigger value="pending-bookings">Pending</TabsTrigger>
          <TabsTrigger value="staff-bookings">Staff Assigned</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-bookings">
          <BookingsTabContent 
            bookings={bookings} 
            onUpdateStatus={(bookingId, status) => 
              updateBookingMutation.mutate({ bookingId, status })
            }
            isUpdating={updateBookingMutation.isPending}
          />
        </TabsContent>
        
        <TabsContent value="pending-bookings">
          <BookingsTabContent 
            bookings={bookings} 
            filterFunction={(booking) => booking.status === 'pending'}
            onUpdateStatus={(bookingId, status) => 
              updateBookingMutation.mutate({ bookingId, status })
            }
            isUpdating={updateBookingMutation.isPending}
            emptyMessage="No pending bookings found."
          />
        </TabsContent>
        
        <TabsContent value="staff-bookings">
          <BookingsTabContent 
            bookings={bookings} 
            filterFunction={(booking) => booking.staff_assigned_id !== null}
            onUpdateStatus={(bookingId, status) => 
              updateBookingMutation.mutate({ bookingId, status })
            }
            isUpdating={updateBookingMutation.isPending}
            emptyMessage="No staff assigned bookings found."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardBookings;
