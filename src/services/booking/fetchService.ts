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
      console.log(`Fetching bookings for tab: ${tab}, user ID: ${userId}, isStaff: ${isStaff}`);
      
      // IMPORTANT: We'll fetch bookings and related data separately to avoid join errors
      let rawBookings = [];
      
      // If staff user, only show bookings assigned to them
      if (isStaff) {
        console.log("Fetching bookings for staff with relation ID:", staffRelationId);
        
        const { data: staffBookings, error: staffBookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('staff_assigned_id', staffRelationId)
          .order('created_at', { ascending: false });
          
        if (staffBookingsError) throw staffBookingsError;
        rawBookings = staffBookings || [];
      } else {
        // Regular business user flow - show all bookings based on tab
        switch (tab) {
          case "all-bookings":
            // Fetch all actual bookings for the business
            console.log(`Fetching all bookings for business: ${userId}`);
            const { data: allBookings, error: allBookingsError } = await supabase
              .from('bookings')
              .select('*')
              .eq('business_id', userId)
              .order('created_at', { ascending: false });
              
            if (allBookingsError) {
              console.error("Error fetching all bookings:", allBookingsError);
              throw allBookingsError;
            }
            
            console.log(`Retrieved ${allBookings?.length || 0} bookings from database`);
            
            // Fetch published templates and convert them to booking format
            const { data: publishedTemplates, error: templatesError } = await supabase
              .from('booking_templates')
              .select('*')
              .eq('business_id', userId)
              .eq('is_published', true)
              .order('created_at', { ascending: false });
              
            if (templatesError) throw templatesError;
            
            console.log(`Found ${allBookings?.length || 0} regular bookings and ${publishedTemplates?.length || 0} templates`);
            
            // Process templates into booking format
            const templateBookings = (publishedTemplates || []).map(template => {
              // Create a booking representation from template
              return {
                id: template.id,
                business_id: template.business_id,
                service_id: template.service_id,
                title: template.name,
                description: template.description,
                status: 'completed' as BookingWithRelations['status'], 
                staff_assigned_id: template.staff_assigned_id,
                created_at: template.created_at,
                updated_at: template.updated_at,
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
            console.log(`Total combined bookings: ${rawBookings.length}`);
            break;
            
          case "templates":
            // In the templates tab, use the dedicated templates management system
            // This will be handled by the BookingTemplatesTab component
            rawBookings = [];
            break;
            
          case "pending-bookings":
            const { data: pendingBookings, error: pendingBookingsError } = await supabase
              .from('bookings')
              .select('*')
              .eq('business_id', userId)
              .eq('status', 'pending')
              .order('created_at', { ascending: false });
              
            if (pendingBookingsError) throw pendingBookingsError;
            rawBookings = pendingBookings || [];
            break;
            
          case "staff-bookings":
            const { data: staffBookings, error: staffBookingsError } = await supabase
              .from('bookings')
              .select('*')
              .eq('business_id', userId)
              .not('staff_assigned_id', 'is', null)
              .order('created_at', { ascending: false });
              
            if (staffBookingsError) throw staffBookingsError;
            rawBookings = staffBookings || [];
            break;
              
          default:
            const { data: defaultBookings, error: defaultBookingsError } = await supabase
              .from('bookings')
              .select('*')
              .eq('business_id', userId)
              .order('created_at', { ascending: false });
              
            if (defaultBookingsError) throw defaultBookingsError;
            rawBookings = defaultBookings || [];
        }
      }
      
      // Now that we have the bookings, let's fetch related services and staff
      const serviceIds = rawBookings
        .filter(booking => booking.service_id)
        .map(booking => booking.service_id);
        
      const staffIds = rawBookings
        .filter(booking => booking.staff_assigned_id)
        .map(booking => booking.staff_assigned_id);
        
      // Fetch related services
      let services = {};
      if (serviceIds.length > 0) {
        const { data: servicesData } = await supabase
          .from('business_services')
          .select('id, name, description, price')
          .in('id', serviceIds);
          
        if (servicesData) {
          services = servicesData.reduce((acc, service) => {
            acc[service.id] = service;
            return acc;
          }, {});
        }
      }
      
      // Fetch related staff
      let staffMembers = {};
      if (staffIds.length > 0) {
        const { data: staffData } = await supabase
          .from('business_staff')
          .select('id, name')
          .in('id', staffIds);
          
        if (staffData) {
          staffMembers = staffData.reduce((acc, staff) => {
            acc[staff.id] = staff;
            return acc;
          }, {});
        }
      }
      
      // Combine bookings with their related data
      bookings = rawBookings.map(booking => {
        const serviceData = booking.service_id ? services[booking.service_id] : null;
        const staffData = booking.staff_assigned_id ? staffMembers[booking.staff_assigned_id] : null;
        
        return {
          ...booking,
          service: serviceData || null,
          staff: staffData || null
        };
      });
      
      console.log(`Successfully processed ${bookings.length} bookings with relations`);
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
