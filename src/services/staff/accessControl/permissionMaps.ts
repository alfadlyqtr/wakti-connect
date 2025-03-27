
/**
 * Maps function names to permission keys
 */
export const functionPermissionMap: Record<string, string> = {
  'editTask': 'can_edit_task',
  'deleteTask': 'can_delete_task',
  'createTask': 'can_create_task',
  'createJob': 'can_create_job_cards',
  'trackHours': 'can_track_hours',
  'messageStaff': 'can_message_staff',
  'messageCustomers': 'can_message_customers',
  'viewAnalytics': 'can_view_own_analytics',
  'editProfile': 'can_edit_profile' // Add the new permission mapping
};
