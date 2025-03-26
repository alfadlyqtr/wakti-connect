
import { supabase } from '@/integrations/supabase/client';
import { TaskWithSharedInfo } from '../types';
import { validateTaskStatus, validateTaskPriority } from '@/services/task/utils/statusValidator';
import { fetchSubtasksForTasks } from './fetchSubtasks';

export const fetchAssignedTasks = async (userId: string, isBusinessAccount = false): Promise<TaskWithSharedInfo[]> => {
  try {
    let query;
    
    // Get the user's email for checking delegated_email
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, id')
      .eq('id', userId)
      .single();
    
    // Also get the user's email from auth.users (if available)
    const { data: authUser } = await supabase.auth.admin.getUserById(userId);
    const userEmail = authUser?.user?.email;
    
    if (isBusinessAccount) {
      // Business account - get tasks created by the business
      query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);
    } else {
      // Regular user or staff - get tasks assigned to them directly, or delegated via email
      // This needs to be a more complex query that handles both assignee_id and delegated_email
      if (userEmail) {
        console.log(`Fetching tasks for ${userId} with email ${userEmail}`);
        
        // Query for tasks assigned either by ID or by email
        query = supabase
          .from('tasks')
          .select('*')
          .or(`assignee_id.eq.${userId},delegated_email.eq.${userEmail}`);
      } else {
        // Fallback to just checking assignee_id if no email is available
        console.log(`Fetching tasks for ${userId} without email check`);
        query = supabase
          .from('tasks')
          .select('*')
          .eq('assignee_id', userId);
      }
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    if (!data) return [];
    
    // Transform task data to ensure correct types
    const typedTasks: TaskWithSharedInfo[] = data.map(task => ({
      ...task,
      status: validateTaskStatus(task.status),
      priority: validateTaskPriority(task.priority)
    })) as TaskWithSharedInfo[];
    
    return await fetchSubtasksForTasks(typedTasks);
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    return [];
  }
};
