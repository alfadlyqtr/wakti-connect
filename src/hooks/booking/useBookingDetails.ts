import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BookingWithRelations } from "@/types/booking.types";
import { toast } from "@/components/ui/use-toast";

interface UseBookingDetailsProps {
  bookingId: string | undefined;
}

interface UseBookingDetailsResult {
  booking: BookingWithRelations | null;
  isLoading: boolean;
  error: string | null;
  serviceName: string;
}

export const useBookingDetails = ({ bookingId }: UseBookingDetailsProps): UseBookingDetailsResult => {
  const location = useLocation();
  const [booking, setBooking] = useState<BookingWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      setIsLoading(true);
      
      try {
        // Check if we have booking data in state
        if (location.state?.booking) {
          setBooking(location.state.booking);
          return;
        }
        
        // Otherwise fetch from database
        if (!bookingId) {
          throw new Error("Booking ID is missing");
        }
        
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            service:service_id (
              name,
              description,
              price
            ),
            staff:staff_assigned_id (
              name
            )
          `)
          .eq('id', bookingId)
          .single();
          
        if (error) throw error;
        if (!data) throw new Error("Booking not found");
        
        // Prepare the booking object with properly typed relations
        const formattedBooking: BookingWithRelations = {
          ...data,
          service: null,
          staff: null
        };
        
        // Check if service exists, is an object, and doesn't have an error
        if (data.service !== null && typeof data.service === 'object') {
          // Need to check for 'error' property before accessing
          // Using type assertion to help TypeScript understand we're checking a generic object
          const serviceObj = data.service as Record<string, unknown>;
          if (!('error' in serviceObj)) {
            // Type assertion after we've checked the shape is correct
            const serviceData = data.service as { name: string; description: string | null; price: number | null };
            formattedBooking.service = {
              name: serviceData.name,
              description: serviceData.description,
              price: serviceData.price
            };
          } else {
            console.warn("Service relation error:", data.service);
          }
        }
        
        // Check if staff exists, is an object, and doesn't have an error
        if (data.staff !== null && typeof data.staff === 'object') {
          // Need to check for 'error' property before accessing
          // Using type assertion to help TypeScript understand we're checking a generic object
          const staffObj = data.staff as Record<string, unknown>;
          if (!('error' in staffObj)) {
            // Type assertion after we've checked the shape is correct
            const staffData = data.staff as { name: string };
            formattedBooking.staff = {
              name: staffData.name
            };
          } else {
            console.warn("Staff relation error:", data.staff);
          }
        }
        
        setBooking(formattedBooking);
      } catch (err: any) {
        console.error("Error fetching booking:", err);
        setError(err.message || "Failed to load booking information");
        toast({
          title: "Error",
          description: "There was a problem loading the booking details",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, location.state]);

  // Determine service name from booking data or template name
  const serviceName = booking?.service?.name || location.state?.templateName || "Service";

  return {
    booking,
    isLoading,
    error,
    serviceName
  };
};
