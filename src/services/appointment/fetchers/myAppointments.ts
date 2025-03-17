
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "../types";

/**
 * Fetches appointments created by the current user
 */
export const fetchMyAppointments = async (
  userRole: "free" | "individual" | "business"
): Promise<Appointment[]> => {
  try {
    // Get current user ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No authenticated user");
    }
    
    const userId = session.user.id;
    
    // Query appointments created by the user
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: true });
    
    if (error) {
      throw new Error(`Failed to fetch my appointments: ${error.message}`);
    }
    
    return appointments || [];
  } catch (error) {
    console.error("Error in fetchMyAppointments:", error);
    return [];
  }
};
