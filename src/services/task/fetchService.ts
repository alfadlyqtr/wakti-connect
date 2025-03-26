
import { supabase } from "@/integrations/supabase/client";
import { TaskTab, TasksResult } from "./types";
import {
  fetchMyTasks,
  fetchSharedTasks,
  fetchAssignedTasks,
  fetchDefaultTasks
} from "./fetchers";
import { clearStaffCache } from "@/utils/staffUtils";

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
  
  // For staff users, we primarily care about assigned tasks
  if (isStaff && (tab === "my-tasks" || tab === "assigned-tasks")) {
    console.log("Fetching assigned tasks for staff member");
    const tasks = await fetchAssignedTasks(session.user.id);
    return {
      tasks,
      userRole: userRole as "free" | "individual" | "business" | "staff"
    };
  }
  
  // Handle regular users based on the selected tab
  switch (tab) {
    case "my-tasks":
      return {
        tasks: await fetchMyTasks(session.user.id),
        userRole: userRole as "free" | "individual" | "business" | "staff"
      };
    
    case "shared-tasks":
      return {
        tasks: await fetchSharedTasks(session.user.id),
        userRole: userRole as "free" | "individual" | "business" | "staff"
      };
    
    case "assigned-tasks":
      return {
        tasks: await fetchAssignedTasks(session.user.id),
        userRole: userRole as "free" | "individual" | "business" | "staff"
      };
    
    default:
      return {
        tasks: await fetchDefaultTasks(session.user.id),
        userRole: userRole as "free" | "individual" | "business" | "staff"
      };
  }
}
