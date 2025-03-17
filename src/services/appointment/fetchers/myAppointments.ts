
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "../types";
import { validateAppointmentStatus } from "../utils/statusValidator";

export const fetchMyAppointments = async (userType: "free" | "individual" | "business"): Promise<Appointment[]> => {
  try {
    // Get the current user's ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      console.error("fetchMyAppointments: No authenticated user found");
      return [];
    }
    
    // Store user ID for future use
    localStorage.setItem('userId', session.user.id);
    
    // Build query
    let query = supabase
      .from('appointments')
      .select(`
        *,
        user:user_id (
          id,
          email,
          display_name
        )
      `)
      .eq('user_id', session.user.id)
      .order('start_time', { ascending: true });
    
    // Apply limit for free users
    if (userType === "free") {
      query = query.limit(5);
    }
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }
    
    // Process appointments
    return data.map((appointment: any) => ({
      ...appointment,
      status: validateAppointmentStatus(appointment.status)
    }));
    
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    return [];
  }
};
