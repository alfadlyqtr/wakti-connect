
import { supabase } from "@/integrations/supabase/client";
import { BookingTab, BookingWithRelations, BookingsResult } from "@/types/booking.types";

/**
 * Fetches bookings based on the selected tab (business accounts only)
 */
export const fetchBookings = async (
  tab: BookingTab
): Promise<BookingsResult> => {
  try {
    let bookings: BookingWithRelations[] = [];

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
      
      let rawBookings = [];
      
      switch (tab) {
        case "all-bookings":
          // Fetch all bookings for the business
          const { data: allBookings, error: allBookingsError } = await supabase
            .from('bookings')
            .select(`
              *,
              service:service_id(name, description, price),
              staff:staff_assigned_id(name)
            `)
            .eq('business_id', userId)
            .order('created_at', { ascending: false });
            
          if (allBookingsError) throw allBookingsError;
          rawBookings = allBookings || [];
          break;
          
        case "pending-bookings":
          // Fetch pending bookings for the business
          const { data: pendingBookings, error: pendingBookingsError } = await supabase
            .from('bookings')
            .select(`
              *,
              service:service_id(name, description, price),
              staff:staff_assigned_id(name)
            `)
            .eq('business_id', userId)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });
            
          if (pendingBookingsError) throw pendingBookingsError;
          rawBookings = pendingBookings || [];
          break;
          
        case "staff-bookings":
          // Fetch bookings assigned to staff
          const { data: staffBookings, error: staffBookingsError } = await supabase
            .from('bookings')
            .select(`
              *,
              service:service_id(name, description, price),
              staff:staff_assigned_id(name)
            `)
            .eq('business_id', userId)
            .not('staff_assigned_id', 'is', null)
            .order('created_at', { ascending: false });
            
          if (staffBookingsError) throw staffBookingsError;
          rawBookings = staffBookings || [];
          break;
            
        default:
          const { data: defaultBookings, error: defaultBookingsError } = await supabase
            .from('bookings')
            .select(`
              *,
              service:service_id(name, description, price),
              staff:staff_assigned_id(name)
            `)
            .eq('business_id', userId)
            .order('created_at', { ascending: false });
            
          if (defaultBookingsError) throw defaultBookingsError;
          rawBookings = defaultBookings || [];
      }
      
      // Process the data to handle potential relation errors
      bookings = rawBookings.map(booking => ({
        ...booking,
        service: booking?.service && typeof booking.service === 'object' && !('error' in booking.service) 
          ? booking.service 
          : null,
        staff: booking?.staff && typeof booking.staff === 'object' && !('error' in booking.staff) 
          ? booking.staff 
          : null
      }));
      
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
