
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

    console.log("Fetching bookings for tab:", tab);

    // Get the user's account type (must be business)
    const { data: userRoleData, error: roleError } = await supabase.rpc(
      "get_auth_user_account_type"
    );

    console.log("User role data:", userRoleData, "Error:", roleError);

    if (roleError) {
      console.error("Error checking user role:", roleError);
      throw new Error(`Failed to check user role: ${roleError.message}`);
    }

    // Check for current authentication
    const { data: authData } = await supabase.auth.getSession();
    console.log("Auth session exists:", !!authData.session, "User ID:", authData.session?.user?.id);
    
    if (!authData.session?.user) {
      console.log("No authenticated user found");
      return {
        bookings: [],
        userRole: userRoleData as "business" | "individual" || "individual"
      };
    }

    if (userRoleData !== "business") {
      console.log("User is not a business account, role:", userRoleData);
      return {
        bookings: [],
        userRole: userRoleData as "business" | "individual" || "individual"
      };
    }

    // Fetch bookings based on the selected tab
    try {
      const userId = await getUserId();
      console.log("Fetching bookings for user ID:", userId);
      
      switch (tab) {
        case "all-bookings":
          // Fetch all bookings for the business
          const { data: allBookings, error: allBookingsError } = await supabase
            .from('bookings')
            .select('*, business_services(*), business_staff(*)')
            .eq('business_id', userId)
            .order('created_at', { ascending: false });
            
          if (allBookingsError) {
            console.error("Error fetching all bookings:", allBookingsError);
            throw allBookingsError;
          }
          console.log("All bookings fetched:", allBookings?.length || 0);
          bookings = allBookings as unknown as Booking[] || [];
          break;
          
        case "pending-bookings":
          // Fetch pending bookings for the business
          const { data: pendingBookings, error: pendingBookingsError } = await supabase
            .from('bookings')
            .select('*, business_services(*), business_staff(*)')
            .eq('business_id', userId)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });
            
          if (pendingBookingsError) {
            console.error("Error fetching pending bookings:", pendingBookingsError);
            throw pendingBookingsError;
          }
          console.log("Pending bookings fetched:", pendingBookings?.length || 0);
          bookings = pendingBookings as unknown as Booking[] || [];
          break;
          
        case "staff-bookings":
          // Fetch bookings assigned to staff
          const { data: staffBookings, error: staffBookingsError } = await supabase
            .from('bookings')
            .select('*, business_services(*), business_staff(*)')
            .eq('business_id', userId)
            .not('staff_assigned_id', 'is', null)
            .order('created_at', { ascending: false });
            
          if (staffBookingsError) {
            console.error("Error fetching staff bookings:", staffBookingsError);
            throw staffBookingsError;
          }
          console.log("Staff bookings fetched:", staffBookings?.length || 0);
          bookings = staffBookings as unknown as Booking[] || [];
          break;
            
        default:
          const { data: defaultBookings, error: defaultBookingsError } = await supabase
            .from('bookings')
            .select('*, business_services(*), business_staff(*)')
            .eq('business_id', userId)
            .order('created_at', { ascending: false });
            
          if (defaultBookingsError) {
            console.error("Error fetching default bookings:", defaultBookingsError);
            throw defaultBookingsError;
          }
          console.log("Default bookings fetched:", defaultBookings?.length || 0);
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
    console.error("No authenticated user in getUserId");
    throw new Error("No authenticated user");
  }
  return session.user.id;
};
