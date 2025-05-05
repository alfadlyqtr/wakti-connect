
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent, ManualCalendarEntry } from "@/types/calendar.types";

// Table name for manual calendar entries
const TABLE_NAME = 'calendar_manual_entries';

// Create a new manual calendar entry
export const createManualEntry = async (entry: Omit<ManualCalendarEntry, 'id' | 'created_at'>): Promise<ManualCalendarEntry | null> => {
  try {
    console.log("Creating entry with date:", entry.date);
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({
        title: entry.title,
        date: entry.date.toISOString(), // Convert Date to ISO string for Supabase
        description: entry.description,
        location: entry.location,
        user_id: entry.user_id
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating manual entry:", error);
      return null;
    }
    
    // Convert date string back to Date object
    return {
      ...data,
      date: new Date(data.date) // Convert date string back to Date object
    } as ManualCalendarEntry;
  } catch (error) {
    console.error("Error in createManualEntry:", error);
    return null;
  }
};

// Fetch manual entries for a user
export const fetchManualEntries = async (userId: string): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error fetching manual entries:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map(entry => ({
      id: entry.id,
      title: entry.title,
      date: new Date(entry.date), // Convert date string back to Date object
      type: 'manual' as const,
      description: entry.description,
      location: entry.location
    }));
  } catch (error) {
    console.error("Error in fetchManualEntries:", error);
    return [];
  }
};

// Update a manual calendar entry
export const updateManualEntry = async (id: string, updates: Partial<ManualCalendarEntry>): Promise<boolean> => {
  try {
    // Create a new object for updates
    const updateData: Record<string, any> = {};
    
    // Copy all updates except date
    Object.keys(updates).forEach(key => {
      if (key !== 'date') {
        updateData[key] = (updates as any)[key];
      }
    });
    
    // Handle date conversion separately
    if (updates.date) {
      updateData.date = updates.date.toISOString();
    }
    
    const { error } = await supabase
      .from(TABLE_NAME)
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error("Error updating manual entry:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateManualEntry:", error);
    return false;
  }
};

// Delete a manual calendar entry
export const deleteManualEntry = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting manual entry:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteManualEntry:", error);
    return false;
  }
};
