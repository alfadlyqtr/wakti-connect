
import { supabase } from "@/integrations/supabase/client";
import { 
  RecurringFormData,
  RecurrenceFrequency
} from "@/types/recurring.types";
import { addDays, addWeeks, addMonths, addYears, setDate } from "date-fns";

/**
 * Creates recurring settings for an entity (task or appointment)
 */
export const createRecurringSetting = async (recurringData: {
  entity_id: string;
  entity_type: 'task' | 'appointment';
  created_by: string;
  frequency: RecurrenceFrequency;
  interval: number;
  days_of_week?: string[];
  day_of_month?: number;
  end_date?: Date | null;
  max_occurrences?: number;
}) => {
  // Get the user's account type to check permissions
  const { data: userRole, error: roleError } = await supabase.rpc(
    "get_auth_user_account_type"
  );

  if (roleError) {
    throw new Error(`Failed to check user role: ${roleError.message}`);
  }

  if (userRole === "free") {
    throw new Error("This feature is only available for paid accounts");
  }

  // Prepare the data for insertion
  const data = {
    entity_id: recurringData.entity_id,
    entity_type: recurringData.entity_type,
    frequency: recurringData.frequency,
    interval: recurringData.interval,
    days_of_week: recurringData.days_of_week || null,
    day_of_month: recurringData.day_of_month || null,
    end_date: recurringData.end_date ? recurringData.end_date.toISOString() : null,
    max_occurrences: recurringData.max_occurrences || null,
    created_by: recurringData.created_by
  };

  const { error } = await supabase.from("recurring_settings").insert(data);

  if (error) {
    throw new Error(`Failed to create recurring settings: ${error.message}`);
  }

  return true;
};

/**
 * Generates dates based on recurring settings
 */
export const generateRecurringDates = (
  startDate: Date,
  recurringData: RecurringFormData,
  limit: number = 10
): Date[] => {
  const dates: Date[] = [];
  const { frequency, interval, days_of_week, day_of_month, end_date, max_occurrences } = recurringData;
  
  // Set maximum dates to generate based on max_occurrences or default limit
  const maxDates = max_occurrences || limit;
  
  let currentDate = new Date(startDate);
  let count = 0;
  
  while (count < maxDates) {
    // Skip the first date since it's the original appointment/task date
    if (count > 0) {
      // Handle different frequency types
      switch (frequency) {
        case 'daily':
          currentDate = addDays(currentDate, interval);
          break;
          
        case 'weekly':
          // For weekly, we'll add weeks and then handle days_of_week if specified
          if (!days_of_week || days_of_week.length === 0) {
            // Simple weekly recurrence
            currentDate = addWeeks(currentDate, interval);
          } else {
            // Skip this implementation for now - it's more complex
            currentDate = addWeeks(currentDate, interval);
          }
          break;
          
        case 'monthly':
          // For monthly, we'll either use the same day of month or a specific one
          if (day_of_month) {
            currentDate = addMonths(currentDate, interval);
            currentDate = setDate(currentDate, day_of_month);
          } else {
            currentDate = addMonths(currentDate, interval);
          }
          break;
          
        case 'yearly':
          currentDate = addYears(currentDate, interval);
          break;
      }
      
      // Stop if we've reached the end date
      if (end_date && currentDate > end_date) {
        break;
      }
      
      dates.push(new Date(currentDate));
    }
    
    count++;
  }
  
  return dates;
};
