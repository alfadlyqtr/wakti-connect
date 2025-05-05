
import { supabase } from "@/integrations/supabase/client";
import { CalendarEntry } from "@/types/calendar.types";

// Create a manual calendar entry
export const createManualEntry = async (
  userId: string, 
  entry: CalendarEntry
): Promise<{ data: any; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('calendar_manual_entries')
      .insert({
        title: entry.title,
        description: entry.description,
        location: entry.location,
        date: entry.date.toISOString(),
        user_id: userId
      })
      .select()
      .single();
    
    return { data, error };
  } catch (error) {
    console.error("Error creating manual entry:", error);
    return { data: null, error };
  }
};

// Update a manual calendar entry
export const updateManualEntry = async (
  entryId: string, 
  entry: Partial<CalendarEntry>
): Promise<{ data: any; error: any }> => {
  try {
    const updateData: any = {};
    
    if (entry.title) updateData.title = entry.title;
    if (entry.description !== undefined) updateData.description = entry.description;
    if (entry.location !== undefined) updateData.location = entry.location;
    if (entry.date) updateData.date = entry.date.toISOString();
    
    const { data, error } = await supabase
      .from('calendar_manual_entries')
      .update(updateData)
      .eq('id', entryId)
      .select()
      .single();
    
    return { data, error };
  } catch (error) {
    console.error("Error updating manual entry:", error);
    return { data: null, error };
  }
};

// Delete a manual calendar entry
export const deleteManualEntry = async (
  entryId: string
): Promise<{ data: any; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('calendar_manual_entries')
      .delete()
      .eq('id', entryId);
    
    return { data, error };
  } catch (error) {
    console.error("Error deleting manual entry:", error);
    return { data: null, error };
  }
};
