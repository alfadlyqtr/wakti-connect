
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
  
  // Declare query result variables outside the switch to avoid deep type instantiation
  let queryResult;
  
  // Use switch case to handle all tab values properly
  switch (tab) {
    case "my-tasks": {
      // User's own tasks
      queryResult = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .order('due_date', { ascending: true });
      break;
    }
    
    case "shared-tasks": {
      // Tasks shared with the user
      queryResult = await supabase
        .from('shared_tasks')
        .select('task_id, tasks(*)')
        .eq('shared_with', session.user.id)
        .order('created_at', { ascending: false });
      break;
    }
    
    case "assigned-tasks": {
      // Tasks assigned to the user (for staff members)
      queryResult = await supabase
        .from('tasks')
        .select('*')
        .eq('assignee_id', session.user.id)
        .order('due_date', { ascending: true });
      break;
    }
    
    default: {
      // Fallback to my-tasks if an invalid tab is provided
      queryResult = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .order('due_date', { ascending: true });
      break;
    }
  }
  
  if (queryResult.error) {
    console.error(`Error fetching ${tab}:`, queryResult.error);
    throw queryResult.error;
  }
  
  let tasks = queryResult.data || [];
  
  // Transform shared tasks data if needed
  if (tab === "shared-tasks") {
    tasks = tasks.map((item: any) => item.tasks);
  }
  
  return { 
    tasks: tasks,
    userRole: userRole as "free" | "individual" | "business"
  };
}
