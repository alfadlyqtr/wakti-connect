import { supabase } from "@/integrations/supabase/client";
import { BookingTab, BookingWithRelations, BookingsResult } from "@/types/booking.types";
import { getStaffRelationId } from "@/utils/staffUtils";

/**
 * Fetches bookings based on the selected tab (business accounts only)
 */
export const fetchBookings = async (
  tab: BookingTab
): Promise<BookingsResult> => {
  try {
    let bookings: BookingWithRelations[] = [];

    // Get the user's account type 
    const { data: userRoleData, error: roleError } = await supabase.rpc(
      "get_auth_user_account_type"
    );

    if (roleError) {
      console.error("Error checking user role:", roleError);
      throw new Error(`Failed to check user role: ${roleError.message}`);
    }

    // Special handling for staff users
    const userRole = userRoleData;
    let isStaff = false;
    let staffRelationId = null;
    
    // Check if user is staff
    const storedIsStaff = localStorage.getItem('isStaff');
    if (storedIsStaff === 'true') {
      isStaff = true;
      staffRelationId = await getStaffRelationId();
      
      if (!staffRelationId) {
        console.error("Staff relation ID not found");
        return {
          bookings: [],
          userRole: "business"
        };
      }
    }

    // For non-business/non-staff accounts, return empty bookings
    if (userRole !== "business" && !isStaff) {
      return {
        bookings: [],
        userRole: "business"
      };
    }

    // Fetch bookings based on the selected tab
    try {
      const userId = await getUserId();
      let rawBookings = [];
      
      // If staff user, only show bookings assigned to them
      if (isStaff) {
        console.log("Fetching bookings for staff with relation ID:", staffRelationId);
        
        const { data: staffBookings, error: staffBookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            service:service_id(name, description, price),
            staff:staff_assigned_id(name)
          `)
          .eq('staff_assigned_id', staffRelationId)
          .order('created_at', { ascending: false });
          
        if (staffBookingsError) throw staffBookingsError;
        rawBookings = staffBookings || [];
      } else {
        // Regular business user flow - show all bookings based on tab
        switch (tab) {
          case "all-bookings":
            // Fetch all actual bookings for the business
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
            
            // Fetch published templates and convert them to booking format
            const { data: publishedTemplates, error: templatesError } = await supabase
              .from('booking_templates')
              .select(`
                *,
                service:service_id(name, description, price),
                staff:staff_assigned_id(name)
              `)
              .eq('business_id', userId)
              .eq('is_published', true)
              .order('created_at', { ascending: false });
              
            if (templatesError) throw templatesError;
            
            // Process templates into booking format
            const templateBookings = (publishedTemplates || []).map(template => {
              // Create a booking representation from template
              return {
                id: template.id,
                business_id: template.business_id,
                service_id: template.service_id,
                title: template.name,
                description: template.description,
                status: 'template' as any, // Special status for templates
                staff_assigned_id: template.staff_assigned_id,
                created_at: template.created_at,
                updated_at: template.updated_at,
                service: template.service,
                staff: template.staff,
                // Template-specific markers
                is_template: true,
                duration: template.duration,
                price: template.price,
                is_published: template.is_published,
                // Dummy values for required booking fields
                start_time: new Date().toISOString(),
                end_time: new Date().toISOString(),
              };
            });
            
            // Combine actual bookings with template representations
            rawBookings = [...(allBookings || []), ...templateBookings];
            break;
            
          case "pending-bookings":
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
      }
      
      // Process the data to handle potential relation errors
      // Explicitly cast the result to BookingWithRelations[]
      bookings = rawBookings.map(booking => ({
        ...booking,
        service: booking.service && typeof booking.service === 'object' ? booking.service : null,
        staff: booking.staff && typeof booking.staff === 'object' ? booking.staff : null
      })) as BookingWithRelations[];
      
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
