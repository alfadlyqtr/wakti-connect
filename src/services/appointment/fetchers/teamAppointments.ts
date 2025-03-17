import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "../types";
import { mapToAppointment } from "../utils/mappers";

/**
 * Fetches team appointments for business accounts
 * (appointments within the same business)
 */
export const fetchTeamAppointments = async (
  userRole: "free" | "individual" | "business"
): Promise<Appointment[]> => {
  // Only business accounts can access team appointments
  if (userRole !== "business") {
    console.log("Team appointments are only available for business accounts");
    return [];
  }
  
  try {
    // Get current user ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No authenticated user");
    }
    
    const userId = session.user.id;
    
    // First get the business ID for the current user
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, business_name')
      .eq('id', userId)
      .single();
    
    if (profileError || !profileData) {
      console.error("Error fetching business profile:", profileError);
      return [];
    }
    
    // Fetch staff members for this business
    const { data: staffData, error: staffError } = await supabase
      .from('business_staff')
      .select('staff_id')
      .eq('business_id', userId);
    
    if (staffError) {
      console.error("Error fetching staff members:", staffError);
      return [];
    }
    
    // Extract staff IDs
    const staffIds = staffData.map(staff => staff.staff_id);
    
    // Include the business owner's ID as well
    const teamMemberIds = [userId, ...staffIds];
    
    // Query appointments where either user_id or assignee_id is in teamMemberIds
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        *,
        user:user_id (
          id,
          email,
          display_name
        ),
        assignee:assignee_id (
          id,
          email,
          display_name
        )
      `)
      .in('user_id', teamMemberIds)
      .order('start_time', { ascending: true });
    
    if (error) {
      throw new Error(`Failed to fetch team appointments: ${error.message}`);
    }
    
    // Map to properly typed Appointment objects 
    return (appointments || []).map(appt => mapToAppointment(appt));
  } catch (error) {
    console.error("Error in fetchTeamAppointments:", error);
    return [];
  }
};
