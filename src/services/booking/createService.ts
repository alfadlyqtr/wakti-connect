
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { BookingFormData, Booking } from "@/types/booking.types";

/**
 * Creates a new booking (business accounts only)
 */
export const createBooking = async (
  bookingData: BookingFormData
): Promise<Booking> => {
  try {
    // First, check if the user is a business account
    const { data: userRoleData, error: roleError } = await supabase.rpc(
      "get_auth_user_account_type"
    );

    if (roleError) {
      console.error("Error checking user role:", roleError);
      throw new Error(`Failed to check user role: ${roleError.message}`);
    }

    if (userRoleData !== "business") {
      toast({
        title: "Business Account Required",
        description: "Only business accounts can create bookings",
        variant: "destructive",
      });
      throw new Error("Business account required to create bookings");
    }
    
    // Get the current user's ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      console.error("No authenticated user for booking creation");
      throw new Error("Authentication required to create bookings");
    }
    
    // Add the business_id to the booking data
    const completeBookingData = {
      ...bookingData,
      business_id: session.user.id,
      status: bookingData.status || 'pending'
    };

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert(completeBookingData)
      .select()
      .single();

    if (error) {
      console.error("Supabase Error creating booking:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!booking) {
      throw new Error("Failed to create booking: No data returned");
    }

    return booking;
  } catch (error: any) {
    console.error("Error in createBooking:", error);
    throw error;
  }
};
