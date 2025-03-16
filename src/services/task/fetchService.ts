
import { supabase } from "@/integrations/supabase/client";
import { TaskTab, TasksResult } from "./types";
import {
  fetchMyTasks,
  fetchSharedTasks,
  fetchAssignedTasks,
  fetchDefaultTasks
} from "./fetchers";

// Fetch tasks based on the selected tab
export async function fetchTasks(tab: TaskTab): Promise<TasksResult> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("No active session");
  }
  
  // Get user profile to check account type
  const { data: profileData } = await supabase
    .from('profiles')
    .select('account_type')
    .eq('id', session.user.id)
    .single();
  
  const userRole = profileData?.account_type || "free";
  
  // Fetch tasks based on the selected tab
  switch (tab) {
    case "my-tasks":
      return {
        tasks: await fetchMyTasks(session.user.id),
        userRole: userRole as "free" | "individual" | "business"
      };
    
    case "shared-tasks":
      return {
        tasks: await fetchSharedTasks(session.user.id),
        userRole: userRole as "free" | "individual" | "business"
      };
    
    case "assigned-tasks":
      return {
        tasks: await fetchAssignedTasks(session.user.id),
        userRole: userRole as "free" | "individual" | "business"
      };
    
    default:
      return {
        tasks: await fetchDefaultTasks(session.user.id),
        userRole: userRole as "free" | "individual" | "business"
      };
  }
}
