
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { BookingFormData, Booking, BookingStatus } from "@/types/booking.types";

/**
 * Creates a new booking (for both business accounts and public users)
 */
export const createBooking = async (
  bookingData: BookingFormData
): Promise<Booking> => {
  try {
    // Check if the user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    const isAuthenticated = !!session?.user?.id;
    
    // For authenticated users, determine if they are a business account
    let userRole = null;
    if (isAuthenticated) {
      const { data: userRoleData, error: roleError } = await supabase.rpc(
        "get_auth_user_account_type"
      );

      if (roleError) {
        console.error("Error checking user role:", roleError);
        // Continue without role check for non-business users
      } else {
        userRole = userRoleData;
      }
    }
    
    // If authenticated as a business, validate the business account requirement
    if (isAuthenticated && userRole === "business") {
      // Business accounts can create bookings on their own behalf
      console.log("Creating booking as business account");
    } else if (bookingData.business_id) {
      // Public booking flow - no special validation needed
      // The business_id comes from the template selected, not the logged-in user
      console.log("Creating public booking for business:", bookingData.business_id);
    } else {
      // In case no business_id is provided
      console.error("Missing business_id for public booking");
      throw new Error("Missing business ID for booking");
    }
    
    // Ensure start_time and end_time are present
    if (!bookingData.start_time || !bookingData.end_time) {
      throw new Error("Booking must have start and end times");
    }
    
    // Ensure we use a valid booking status (explicitly cast)
    const status = bookingData.status || 'pending';
    
    // Prepare booking data with all required fields
    const completeBookingData: any = {
      title: bookingData.title,
      description: bookingData.description,
      service_id: bookingData.service_id,
      customer_name: bookingData.customer_name,
      customer_email: bookingData.customer_email,
      customer_phone: bookingData.customer_phone,
      start_time: bookingData.start_time,
      end_time: bookingData.end_time,
      status: status as BookingStatus,
      staff_assigned_id: bookingData.staff_assigned_id,
      staff_name: bookingData.staff_name, // Include staff_name in the booking
      price: bookingData.price
    };
    
    // Set business_id appropriately based on context
    if (isAuthenticated && userRole === "business") {
      // For business users, set the business_id to their user ID
      completeBookingData.business_id = session.user.id;
    } else {
      // For public bookings, use the provided business_id
      completeBookingData.business_id = bookingData.business_id;
    }
    
    // Set customer_id if the user is authenticated (but not a business account)
    if (isAuthenticated && userRole !== "business") {
      completeBookingData.customer_id = session.user.id;
    }
    
    console.log("Creating booking with data:", completeBookingData);

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
