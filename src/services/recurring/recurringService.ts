
import { supabase } from "@/integrations/supabase/client";
import { RecurringSettings, RecurringFormData, EntityType } from "@/types/recurring.types";

// Create recurring settings for a task or appointment
export async function createRecurringSetting(
  entityId: string, 
  entityType: EntityType, 
  recurringData: RecurringFormData
): Promise<RecurringSettings> {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session?.session) {
    throw new Error("Authentication required");
  }
  
  const settingsData = {
    entity_id: entityId,
    entity_type: entityType,
    frequency: recurringData.frequency,
    interval: recurringData.interval,
    days_of_week: recurringData.days_of_week,
    day_of_month: recurringData.day_of_month,
    end_date: recurringData.end_date ? recurringData.end_date.toISOString() : null,
    max_occurrences: recurringData.max_occurrences,
    created_by: session.session.user.id
  };
  
  const { data, error } = await supabase
    .from('recurring_settings')
    .insert(settingsData)
    .select()
    .single();
    
  if (error) {
    if (error.code === '42501') {
      throw new Error("This feature is only available for paid accounts");
    }
    throw error;
  }
  
  return data as RecurringSettings;
}

// Update recurring settings
export async function updateRecurringSetting(
  id: string,
  recurringData: Partial<RecurringFormData>
): Promise<RecurringSettings> {
  const { data, error } = await supabase
    .from('recurring_settings')
    .update({
      frequency: recurringData.frequency,
      interval: recurringData.interval,
      days_of_week: recurringData.days_of_week,
      day_of_month: recurringData.day_of_month,
      end_date: recurringData.end_date ? recurringData.end_date.toISOString() : null,
      max_occurrences: recurringData.max_occurrences,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  
  return data as RecurringSettings;
}

// Delete recurring settings
export async function deleteRecurringSetting(id: string): Promise<void> {
  const { error } = await supabase
    .from('recurring_settings')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
}

// Get recurring settings for an entity
export async function getRecurringSettings(
  entityId: string,
  entityType: EntityType
): Promise<RecurringSettings | null> {
  const { data, error } = await supabase
    .from('recurring_settings')
    .select('*')
    .eq('entity_id', entityId)
    .eq('entity_type', entityType)
    .maybeSingle();
    
  if (error) throw error;
  
  return data as RecurringSettings | null;
}

// Generate dates for recurring entities
export function generateRecurringDates(
  startDate: Date,
  settings: RecurringSettings,
  count: number = 10
): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  
  for (let i = 0; i < count; i++) {
    // Skip the first date as it's the original entity date
    if (i > 0) {
      const nextDate = calculateNextDate(currentDate, settings);
      if (nextDate) {
        // Check if we've reached the end date
        if (settings.end_date && new Date(nextDate) > new Date(settings.end_date)) {
          break;
        }
        
        // Check if we've reached max occurrences
        if (settings.max_occurrences && i >= settings.max_occurrences) {
          break;
        }
        
        dates.push(nextDate);
        currentDate = nextDate;
      } else {
        break;
      }
    } else {
      dates.push(currentDate);
    }
  }
  
  return dates;
}

// Helper to calculate the next date based on frequency and interval
function calculateNextDate(date: Date, settings: RecurringSettings): Date {
  const nextDate = new Date(date);
  
  switch (settings.frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + settings.interval);
      break;
      
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + (settings.interval * 7));
      break;
      
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + settings.interval);
      if (settings.day_of_month) {
        nextDate.setDate(Math.min(settings.day_of_month, getDaysInMonth(nextDate.getFullYear(), nextDate.getMonth())));
      }
      break;
      
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + settings.interval);
      break;
  }
  
  return nextDate;
}

// Helper to get days in a month
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
