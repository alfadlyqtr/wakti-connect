import { supabase } from "@/integrations/supabase/client";
import { Reminder, ReminderFormData, ReminderNotification } from "@/types/reminder.types";

export async function fetchReminders(): Promise<Reminder[]> {
  try {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('is_active', true)
      .order('reminder_time', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching reminders:", error);
    throw error;
  }
}

export async function createReminder(reminderData: ReminderFormData): Promise<Reminder> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("You must be logged in to create reminders");
    }
    
    // Convert the Date object to ISO string, preserving timezone information
    const reminderTime = reminderData.reminder_time instanceof Date 
      ? reminderData.reminder_time.toISOString()
      : new Date(reminderData.reminder_time).toISOString();
    
    const newReminder = {
      user_id: session.user.id,
      message: reminderData.message,
      reminder_time: reminderTime,
      repeat_type: reminderData.repeat_type
    };
    
    const { data, error } = await supabase
      .from('reminders')
      .insert(newReminder)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating reminder:", error);
    throw error;
  }
}

export async function deleteReminder(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting reminder:", error);
    throw error;
  }
}

export async function updateReminder(id: string, updates: Partial<Reminder>): Promise<Reminder> {
  try {
    const { data, error } = await supabase
      .from('reminders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating reminder:", error);
    throw error;
  }
}

export async function createReminderNotification(
  reminderId: string, 
  snoozedUntil?: Date
): Promise<ReminderNotification> {
  try {
    const notification = {
      reminder_id: reminderId,
      snoozed_until: snoozedUntil ? snoozedUntil.toISOString() : null
    };
    
    const { data, error } = await supabase
      .from('reminder_notifications')
      .insert(notification)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating reminder notification:", error);
    throw error;
  }
}

export async function dismissReminderNotification(notificationId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('reminder_notifications')
      .update({ is_dismissed: true })
      .eq('id', notificationId);
      
    if (error) throw error;
  } catch (error) {
    console.error("Error dismissing reminder notification:", error);
    throw error;
  }
}

export async function snoozeReminder(
  notificationId: string, 
  snoozeMinutes: number
): Promise<ReminderNotification> {
  try {
    const snoozedUntil = new Date();
    snoozedUntil.setMinutes(snoozedUntil.getMinutes() + snoozeMinutes);
    
    const { data, error } = await supabase
      .from('reminder_notifications')
      .update({ 
        snoozed_until: snoozedUntil.toISOString(),
        is_dismissed: false 
      })
      .eq('id', notificationId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error snoozing reminder:", error);
    throw error;
  }
}
