
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/types/calendar.types";

// Fetch appointments created by user
export const fetchMyAppointments = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('id, title, start_time')
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error fetching my appointments:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map(appointment => ({
      id: appointment.id,
      title: appointment.title,
      date: new Date(appointment.start_time),
      type: 'appointment' as const
    }));
  } catch (error) {
    console.error("Error in fetchMyAppointments:", error);
    return [];
  }
};

// Fetch appointments assigned to user
export const fetchAssignedAppointments = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('id, title, start_time')
      .eq('assignee_id', userId);
    
    if (error) {
      console.error("Error fetching assigned appointments:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map(appointment => ({
      id: appointment.id,
      title: appointment.title,
      date: new Date(appointment.start_time),
      type: 'appointment' as const
    }));
  } catch (error) {
    console.error("Error in fetchAssignedAppointments:", error);
    return [];
  }
};

// Fetch appointments user was invited to and accepted
export const fetchInvitedAppointments = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('appointment_invitations')
      .select('appointment_id, appointments(id, title, start_time)')
      .eq('invited_user_id', userId)
      .eq('status', 'accepted');
    
    if (error) {
      console.error("Error fetching invited appointments:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return data
      .filter(invitation => invitation.appointments !== null)
      .map(invitation => ({
        id: invitation.appointments.id,
        title: invitation.appointments.title,
        date: new Date(invitation.appointments.start_time),
        type: 'appointment' as const
      }));
  } catch (error) {
    console.error("Error in fetchInvitedAppointments:", error);
    return [];
  }
};

// Fetch all appointments for a user (combines my, assigned, and invited)
export const fetchAllAppointments = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    const [myAppointments, assignedAppointments, invitedAppointments] = await Promise.all([
      fetchMyAppointments(userId),
      fetchAssignedAppointments(userId),
      fetchInvitedAppointments(userId)
    ]);
    
    return [...myAppointments, ...assignedAppointments, ...invitedAppointments];
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    return [];
  }
};
