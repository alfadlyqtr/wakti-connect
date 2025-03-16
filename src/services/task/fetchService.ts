
import { supabase } from "@/integrations/supabase/client";
import { TaskTab, TasksResult } from "./types";

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
  
  let data;
  let error;
  
  // Use switch case to avoid deep type instantiation
  switch (tab) {
    case "my-tasks": {
      // User's own tasks
      const result = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .order('due_date', { ascending: true });
      
      data = result.data;
      error = result.error;
      break;
    }
    
    case "shared-tasks": {
      // Tasks shared with the user
      const result = await supabase
        .from('shared_tasks')
        .select('task_id, tasks(*)')
        .eq('shared_with', session.user.id)
        .order('created_at', { ascending: false });
      
      data = result.data;
      error = result.error;
      break;
    }
    
    case "assigned-tasks": {
      // Tasks assigned to the user (for staff members)
      const result = await supabase
        .from('tasks')
        .select('*')
        .eq('assignee_id', session.user.id)
        .order('due_date', { ascending: true });
      
      data = result.data;
      error = result.error;
      break;
    }
    
    default: {
      // Fallback to my-tasks if an invalid tab is provided
      const result = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .order('due_date', { ascending: true });
      
      data = result.data;
      error = result.error;
      break;
    }
  }
  
  if (error) {
    console.error(`Error fetching ${tab}:`, error);
    throw error;
  }
  
  // Transform shared tasks data if needed
  const transformedData = tab === "shared-tasks" 
    ? data.map((item: any) => item.tasks) 
    : data;
  
  return { 
    tasks: transformedData || [],
    userRole: userRole as "free" | "individual" | "business"
  };
}
