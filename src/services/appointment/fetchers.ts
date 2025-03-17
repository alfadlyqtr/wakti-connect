
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "./types";

// Base query to fetch appointments with all needed fields
const getBaseAppointmentQuery = () => {
  return supabase
    .from("appointments")
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
    `);
};

// Helper to handle errors consistently
const handleAppointmentFetchError = (error: any, tabName: string) => {
  console.error(`Error fetching ${tabName} appointments:`, error);
  return [];
};

/**
 * Fetches the current user's appointments
 */
export const fetchMyAppointments = async (
  userRole: "free" | "individual" | "business"
): Promise<Appointment[]> => {
  try {
    const query = getBaseAppointmentQuery().order("start_time", { ascending: true });
    
    // For free users, we limit the number of appointments they can see
    if (userRole === "free") {
      query.limit(5);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    return handleAppointmentFetchError(error, "my");
  }
};

/**
 * Fetches appointments shared with the current user
 */
export const fetchSharedAppointments = async (
  userRole: "free" | "individual" | "business"
): Promise<Appointment[]> => {
  if (userRole === "free") {
    return []; // Free users can't have shared appointments
  }
  
  try {
    const { data, error } = await supabase
      .from("appointment_sharing")
      .select(`
        appointment:appointment_id (
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
        )
      `)
      .order("created_at", { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Extract the appointment from each sharing record
    return (data || [])
      .map(record => record.appointment)
      .filter(Boolean);
  } catch (error) {
    return handleAppointmentFetchError(error, "shared");
  }
};

/**
 * Fetches appointments assigned to the current user
 */
export const fetchAssignedAppointments = async (
  userRole: "free" | "individual" | "business"
): Promise<Appointment[]> => {
  if (userRole === "free") {
    return []; // Free users can't have assigned appointments
  }
  
  try {
    const { data, error } = await getBaseAppointmentQuery()
      .not("assignee_id", "is", null)
      .order("start_time", { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    return handleAppointmentFetchError(error, "assigned");
  }
};

/**
 * Default appointment fetcher (used for team view and fallback)
 */
export const fetchDefaultAppointments = async (
  userRole: "free" | "individual" | "business"
): Promise<Appointment[]> => {
  try {
    const query = getBaseAppointmentQuery().order("start_time", { ascending: true });
    
    if (userRole === "free") {
      query.limit(5);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    return handleAppointmentFetchError(error, "default");
  }
};

/**
 * Fetches upcoming appointments (start time in the future)
 */
export const fetchUpcomingAppointments = async (
  userRole: "free" | "individual" | "business"
): Promise<Appointment[]> => {
  try {
    const now = new Date().toISOString();
    const query = getBaseAppointmentQuery()
      .gte("start_time", now)
      .order("start_time", { ascending: true });
    
    if (userRole === "free") {
      query.limit(3);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    return handleAppointmentFetchError(error, "upcoming");
  }
};

/**
 * Fetches past appointments (end time in the past)
 */
export const fetchPastAppointments = async (
  userRole: "free" | "individual" | "business"
): Promise<Appointment[]> => {
  try {
    const now = new Date().toISOString();
    const query = getBaseAppointmentQuery()
      .lt("end_time", now)
      .order("start_time", { ascending: false });
    
    if (userRole === "free") {
      query.limit(3);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    return handleAppointmentFetchError(error, "past");
  }
};

/**
 * Fetches appointment invitations for the current user
 */
export const fetchInvitationAppointments = async (
  userRole: "free" | "individual" | "business"
): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from("appointment_invitations")
      .select(`
        appointment:appointment_id (
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
        )
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Extract the appointment from each invitation record
    return (data || [])
      .map(record => record.appointment)
      .filter(Boolean);
  } catch (error) {
    return handleAppointmentFetchError(error, "invitation");
  }
};
