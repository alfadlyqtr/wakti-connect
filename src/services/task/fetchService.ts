
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskTab } from "@/types/task.types";
import {
  fetchMyTasks,
  fetchSharedTasks,
  fetchAssignedTasks,
  fetchDefaultTasks
} from "./fetchers";
import { clearStaffCache } from "@/utils/staffUtils";

// Interface for the result of fetchTasks
export interface TasksResult {
  tasks: Task[];
  userRole: "free" | "individual" | "business" | "staff";
}

// Fetch tasks based on the selected tab
export async function fetchTasks(tab: TaskTab): Promise<TasksResult> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("No active session");
  }
  
  // Clear staff cache to ensure we have the latest data
  // This helps if the user was just assigned as staff
  await clearStaffCache();
  
  // First check if user is staff (this will repopulate cache if needed)
  const { data: staffData } = await supabase
    .from('business_staff')
    .select('id, permissions, business_id, role')
    .eq('staff_id', session.user.id)
    .eq('status', 'active')
    .maybeSingle();
    
  const isStaff = !!staffData;
  
  // Get user profile for non-staff or additional staff info
  const { data: profileData } = await supabase
    .from('profiles')
    .select('account_type')
    .eq('id', session.user.id)
    .single();
  
  const userRole = isStaff ? "staff" : (profileData?.account_type || "free");
  console.log(`User role determined: ${userRole}, Is staff: ${isStaff}`);
  
  // Since we've simplified the task system to only support "my-tasks",
  // we now only fetch the user's own tasks
  const tasks = await fetchMyTasks(session.user.id);
  
  return {
    tasks,
    userRole: userRole as "free" | "individual" | "business" | "staff"
  };
}
