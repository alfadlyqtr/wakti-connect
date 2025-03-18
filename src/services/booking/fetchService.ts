
import { supabase } from "@/integrations/supabase/client";
import { Booking, BookingStatus, BookingTab, BookingsResult } from "@/types/booking.types";

/**
 * Fetches bookings based on the selected tab (business accounts only)
 */
export const fetchBookings = async (
  tab: BookingTab
): Promise<BookingsResult> => {
  try {
    let bookings: Booking[] = [];

    // Get the user's account type (must be business)
    const { data: userRoleData, error: roleError } = await supabase.rpc(
      "get_auth_user_account_type"
    );

    if (roleError) {
      console.error("Error checking user role:", roleError);
      throw new Error(`Failed to check user role: ${roleError.message}`);
    }

    if (userRoleData !== "business") {
      return {
        bookings: [],
        userRole: "business"
      };
    }

    // Fetch bookings based on the selected tab
    try {
      const userId = await getUserId();
      
      switch (tab) {
        case "all-bookings":
          // Fetch all bookings for the business
          const { data: allBookings, error: allBookingsError } = await supabase
            .from('bookings')
            .select('*')
            .eq('business_id', userId)
            .order('created_at', { ascending: false });
            
          if (allBookingsError) throw allBookingsError;
          bookings = allBookings as unknown as Booking[] || [];
          break;
          
        case "pending-bookings":
          // Fetch pending bookings for the business
          const { data: pendingBookings, error: pendingBookingsError } = await supabase
            .from('bookings')
            .select('*')
            .eq('business_id', userId)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });
            
          if (pendingBookingsError) throw pendingBookingsError;
          bookings = pendingBookings as unknown as Booking[] || [];
          break;
          
        case "staff-bookings":
          // Fetch bookings assigned to staff
          const { data: staffBookings, error: staffBookingsError } = await supabase
            .from('bookings')
            .select('*')
            .eq('business_id', userId)
            .not('staff_assigned_id', 'is', null)
            .order('created_at', { ascending: false });
            
          if (staffBookingsError) throw staffBookingsError;
          bookings = staffBookings as unknown as Booking[] || [];
          break;
            
        default:
          const { data: defaultBookings, error: defaultBookingsError } = await supabase
            .from('bookings')
            .select('*')
            .eq('business_id', userId)
            .order('created_at', { ascending: false });
            
          if (defaultBookingsError) throw defaultBookingsError;
          bookings = defaultBookings as unknown as Booking[] || [];
      }
    } catch (fetchError: any) {
      console.error(`Error fetching bookings for tab "${tab}":`, fetchError);
      bookings = [];
    }

    return {
      bookings,
      userRole: "business"
    };
  } catch (error: any) {
    console.error("Error in fetchBookings:", error);
    return {
      bookings: [],
      userRole: "business"
    };
  }
};

/**
 * Helper to get the current user ID
 */
const getUserId = async (): Promise<string> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error("No authenticated user");
  }
  return session.user.id;
};
