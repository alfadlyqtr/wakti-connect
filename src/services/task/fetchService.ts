
import { supabase } from "@/integrations/supabase/client";
import { TaskTab, TasksResult, Task } from "./types";

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
  
  // Declare variable to hold query results
  let tasksData: Task[] = [];
  
  // Use switch case to handle all tab values properly
  switch (tab) {
    case "my-tasks": {
      // User's own tasks
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .order('due_date', { ascending: true });
        
      if (error) throw error;
      tasksData = data || [];
      break;
    }
    
    case "shared-tasks": {
      // Tasks shared with the user
      const { data, error } = await supabase
        .from('shared_tasks')
        .select('task_id, tasks(*)')
        .eq('shared_with', session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      tasksData = data ? data.map(item => item.tasks as Task) : [];
      break;
    }
    
    case "assigned-tasks": {
      // Tasks assigned to the user (for staff members)
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assignee_id', session.user.id)
        .order('due_date', { ascending: true });
        
      if (error) throw error;
      tasksData = data || [];
      break;
    }
    
    default: {
      // Fallback to my-tasks if an invalid tab is provided
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .order('due_date', { ascending: true });
        
      if (error) throw error;
      tasksData = data || [];
      break;
    }
  }
  
  return { 
    tasks: tasksData,
    userRole: userRole as "free" | "individual" | "business"
  };
}
