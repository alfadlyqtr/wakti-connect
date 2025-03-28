
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { BookingFormData, Booking, BookingStatus } from "@/types/booking.types";

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
    
    // Ensure start_time and end_time are present
    if (!bookingData.start_time || !bookingData.end_time) {
      throw new Error("Booking must have start and end times");
    }
    
    // Ensure we use a valid booking status (explicitly cast)
    const status = bookingData.status || 'pending';
    
    // Add the business_id to the booking data
    const completeBookingData = {
      business_id: session.user.id,
      title: bookingData.title,
      description: bookingData.description,
      service_id: bookingData.service_id,
      customer_id: bookingData.customer_id,
      customer_email: bookingData.customer_email,
      customer_name: bookingData.customer_name,
      customer_phone: bookingData.customer_phone, // Include the phone field
      start_time: bookingData.start_time,
      end_time: bookingData.end_time,
      status: status as BookingStatus, // Ensure this is a valid BookingStatus
      staff_assigned_id: bookingData.staff_assigned_id,
      price: bookingData.price // Include the price field
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
