
/**
 * Types for audit logging system
 */

export interface AuditLog {
  id: string;
  user_id: string;
  action_type: string;
  metadata: Record<string, any>;
  created_at: string;
}

export type ActionType = 
  | 'super_admin_access'
  | 'impersonate_user'
  | 'system_configuration_change'
  | 'security_change'
  | 'user_status_change';

/**
 * Helper function to create an audit log entry
 * Falls back gracefully if the audit_logs table doesn't exist
 */
export const createAuditLog = async (
  supabase: any,
  userId: string,
  actionType: ActionType,
  metadata: Record<string, any>
): Promise<void> => {
  try {
    // First check if table exists to avoid error
    const { data: tableExists } = await supabase
      .from('_metadata')
      .select('*')
      .eq('table_name', 'audit_logs')
      .single();
      
    if (tableExists) {
      try {
        await supabase
          .from('audit_logs')
          .insert({
            user_id: userId,
            action_type: actionType,
            metadata
          });
      } catch (error) {
        console.warn("Could not log to audit system:", error);
      }
    } else {
      console.warn("Audit logs table does not exist yet - skipping audit logging");
    }
  } catch (error) {
    console.warn("Error checking for audit_logs table:", error);
  }
};
