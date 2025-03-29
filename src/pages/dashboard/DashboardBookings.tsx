
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
import NoShowBookingsTab from "@/components/bookings/NoShowBookingsTab";

const DashboardBookings = () => {
  const { activeTab, setActiveTab } = useBookingsTabState();
  const queryClient = useQueryClient();
  const isStaff = localStorage.getItem('isStaff') === 'true';
  
  // Fetch bookings based on the selected tab
  const { 
    bookings,
    noShowBookings, 
    isLoading, 
    error, 
    refetch,
    updateStatus,
    acknowledgeBooking,
    markNoShow,
    approveNoShow,
    rejectNoShow
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

  // Mutation to send notification when booking status changes
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

  // Function to handle booking status updates
  const handleUpdateStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      // Skip processing for templates
      const booking = bookings.find(b => b.id === bookingId);
      if (booking && (booking as any).is_template) {
        console.log("Attempted to update a template booking - skipping", bookingId);
        return;
      }
      
      console.log(`Updating booking ${bookingId} status to ${status}`);
      
      // Call the mutation
      await updateStatus.mutateAsync({ bookingId, status });
      
      // Send notification
      sendStatusNotification(bookingId, status);
    } catch (error) {
      console.error("Error in handleUpdateStatus:", error);
    }
  };

  // Function to handle booking acknowledgment
  const handleAcknowledgeBooking = async (bookingId: string) => {
    try {
      await acknowledgeBooking.mutateAsync(bookingId);
    } catch (error) {
      console.error("Error acknowledging booking:", error);
    }
  };

  // Function to handle marking a booking as no-show
  const handleMarkNoShow = async (bookingId: string) => {
    try {
      await markNoShow.mutateAsync(bookingId);
    } catch (error) {
      console.error("Error marking booking as no-show:", error);
    }
  };

  // Functions to handle approving/rejecting no-shows
  const handleApproveNoShow = async (bookingId: string) => {
    try {
      await approveNoShow.mutateAsync(bookingId);
    } catch (error) {
      console.error("Error approving no-show:", error);
    }
  };

  const handleRejectNoShow = async (bookingId: string) => {
    try {
      await rejectNoShow.mutateAsync(bookingId);
    } catch (error) {
      console.error("Error rejecting no-show:", error);
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
          onUpdateStatus={handleUpdateStatus}
          onAcknowledgeBooking={handleAcknowledgeBooking}
          onMarkNoShow={handleMarkNoShow}
          isUpdating={updateStatus.isPending}
          isAcknowledging={acknowledgeBooking.isPending}
          isMarkingNoShow={markNoShow.isPending}
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
          <TabsTrigger value="no-show-bookings">No Shows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-bookings">
          <BookingsTabContent 
            bookings={bookings} 
            onUpdateStatus={handleUpdateStatus}
            isUpdating={updateStatus.isPending}
          />
        </TabsContent>
        
        <TabsContent value="pending-bookings">
          <BookingsTabContent 
            bookings={bookings} 
            filterFunction={(booking) => booking.status === 'pending'}
            onUpdateStatus={handleUpdateStatus}
            isUpdating={updateStatus.isPending}
            emptyMessage="No pending bookings found."
          />
        </TabsContent>
        
        <TabsContent value="staff-bookings">
          <BookingsTabContent 
            bookings={bookings} 
            filterFunction={(booking) => booking.staff_assigned_id !== null}
            onUpdateStatus={handleUpdateStatus}
            isUpdating={updateStatus.isPending}
            emptyMessage="No staff assigned bookings found."
          />
        </TabsContent>
        
        <TabsContent value="no-show-bookings">
          <NoShowBookingsTab 
            noShowBookings={noShowBookings}
            onApproveNoShow={handleApproveNoShow}
            onRejectNoShow={handleRejectNoShow}
            isApproving={approveNoShow.isPending}
            isRejecting={rejectNoShow.isPending}
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
