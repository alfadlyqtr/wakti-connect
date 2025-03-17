
import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentStatus, UserProfile } from "./types";
import { validateAppointmentStatus } from "./utils/statusValidator";

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

// Helper to map database results to Appointment type with valid status and properly formatted user/assignee
const mapToAppointments = (data: any[]): Appointment[] => {
  return (data || []).map(item => {
    // Create a properly typed Appointment object
    const appointment: Appointment = {
      ...item,
      status: validateAppointmentStatus(item.status),
      // Make sure user and assignee are properly formatted or null
      user: item.user ? {
        id: item.user.id || '',
        email: item.user.email || '',
        display_name: item.user.display_name
      } as UserProfile : null,
      assignee: item.assignee ? {
        id: item.assignee.id || '',
        email: item.assignee.email || '',
        display_name: item.assignee.display_name
      } as UserProfile : null
    };
    
    return appointment;
  });
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
    
    return mapToAppointments(data || []);
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
      .order("created_at", { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Extract the appointment from each invitation record and ensure valid status
    const appointments = (data || [])
      .map(record => record.appointment)
      .filter(Boolean)
      .map(appt => ({
        ...appt,
        status: validateAppointmentStatus(appt.status),
        user: appt.user ? {
          id: appt.user.id || '',
          email: appt.user.email || '',
          display_name: appt.user.display_name
        } : null,
        assignee: appt.assignee ? {
          id: appt.assignee.id || '',
          email: appt.assignee.email || '',
          display_name: appt.assignee.display_name
        } : null
      }));
    
    return appointments;
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
    
    return mapToAppointments(data || []);
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
    
    return mapToAppointments(data || []);
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
    
    return mapToAppointments(data || []);
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
    
    return mapToAppointments(data || []);
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
    
    // Extract the appointment from each invitation record and validate status
    const appointments = (data || [])
      .map(record => record.appointment)
      .filter(Boolean)
      .map(appt => ({
        ...appt,
        status: validateAppointmentStatus(appt.status),
        user: appt.user ? {
          id: appt.user.id || '',
          email: appt.user.email || '',
          display_name: appt.user.display_name
        } : null,
        assignee: appt.assignee ? {
          id: appt.assignee.id || '',
          email: appt.assignee.email || '',
          display_name: appt.assignee.display_name
        } : null
      }));
    
    return appointments;
  } catch (error) {
    return handleAppointmentFetchError(error, "invitation");
  }
};
