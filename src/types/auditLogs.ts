
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Creates an audit log entry in the database
 * 
 * @param supabase Supabase client instance
 * @param userId User ID performing the action
 * @param actionType Type of action being audited
 * @param metadata Additional data related to the action
 * @returns Promise with the result of the operation
 */
export async function createAuditLog(
  supabase: SupabaseClient,
  userId: string,
  actionType: string,
  metadata: Record<string, any> = {}
): Promise<void> {
  try {
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action_type: actionType,
        metadata
      });
      
    if (error) {
      console.error("Error creating audit log:", error);
      throw error;
    }
  } catch (error) {
    console.error("Failed to create audit log:", error);
    // We don't want to throw here as audit logging should not block main functionality
  }
}
