
import React, { useEffect } from "react";
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
import BookingTemplatesTab from "@/components/bookings/templates/BookingTemplatesTab";

const DashboardBookings = () => {
  const { activeTab, setActiveTab } = useBookingsTabState();
  const queryClient = useQueryClient();
  const isStaff = localStorage.getItem('isStaff') === 'true';
  
  // Fetch bookings based on the selected tab
  const { 
    bookings, 
    isLoading, 
    error, 
    refetch 
  } = useBookings(isStaff ? 'all-bookings' : activeTab);

  // Log bookings data for debugging
  useEffect(() => {
    if (bookings.length > 0) {
      console.log(`Retrieved ${bookings.length} bookings for tab ${activeTab}`);
      
      // Check for templates
      const templates = bookings.filter(b => (b as any).is_template);
      if (templates.length > 0) {
        console.log(`Found ${templates.length} template bookings`);
      }
    } else {
      console.log(`No bookings found for tab ${activeTab}. Check if there's an issue with data fetching.`);
      // Force a refresh after a short delay
      const timer = setTimeout(() => {
        console.log("Triggering a manual refetch of bookings data");
        refetch();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [bookings, activeTab, refetch]);

  // Mutation to update booking status
  const updateBookingMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string, status: BookingStatus }) => {
      // Don't try to update templates (they're not real bookings)
      const booking = bookings.find(b => b.id === bookingId);
      if (booking && (booking as any).is_template) {
        console.log("Attempted to update a template booking - skipping", bookingId);
        return { bookingId, status: 'completed' as BookingStatus };
      }
      
      console.log(`Updating booking ${bookingId} status to ${status}`);
      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId);
        
      if (error) throw error;
      
      return { bookingId, status };
    },
    onSuccess: (data) => {
      // Skip notifications for templates
      if ((data.bookingId && bookings.find(b => b.id === data.bookingId && (b as any).is_template))) {
        return;
      }
      
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

  // For staff users, we show a simplified view with just their bookings
  if (isStaff) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            View and manage bookings assigned to you
          </p>
        </div>
        
        <BookingsTabContent 
          bookings={bookings} 
          onUpdateStatus={(bookingId, status) => 
            updateBookingMutation.mutate({ bookingId, status })
          }
          isUpdating={updateBookingMutation.isPending}
          emptyMessage="No bookings have been assigned to you yet."
        />
      </div>
    );
  }

  // For business users, show the full tabbed interface
  return (
    <div className="container py-8">
      <BookingsHeader setActiveTab={setActiveTab} />
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BookingTab)}>
        <TabsList className="mb-6">
          <TabsTrigger value="all-bookings">All Bookings</TabsTrigger>
          <TabsTrigger value="pending-bookings">Pending</TabsTrigger>
          <TabsTrigger value="staff-bookings">Staff Assigned</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
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
        
        <TabsContent value="templates">
          <BookingTemplatesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardBookings;
