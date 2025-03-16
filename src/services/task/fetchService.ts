
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
  let { data: tasksData = [], error } = { data: [] as any[], error: null };
  
  // Use switch case to handle all tab values properly
  switch (tab) {
    case "my-tasks": {
      // User's own tasks
      const response = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .order('due_date', { ascending: true });
        
      if (response.error) throw response.error;
      tasksData = response.data || [];
      break;
    }
    
    case "shared-tasks": {
      // Tasks shared with the user
      const response = await supabase
        .from('shared_tasks')
        .select('task_id, tasks(*)')
        .eq('shared_with', session.user.id)
        .order('created_at', { ascending: false });
        
      if (response.error) throw response.error;
      tasksData = response.data?.map(item => item.tasks as Task) || [];
      break;
    }
    
    case "assigned-tasks": {
      // Tasks assigned to the user (for staff members)
      const response = await supabase
        .from('tasks')
        .select('*')
        .eq('assignee_id', session.user.id)
        .order('due_date', { ascending: true });
        
      if (response.error) throw response.error;
      tasksData = response.data || [];
      break;
    }
    
    default: {
      // Fallback to my-tasks if an invalid tab is provided
      const response = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .order('due_date', { ascending: true });
        
      if (response.error) throw response.error;
      tasksData = response.data || [];
      break;
    }
  }
  
  // Ensure all task objects have default values for missing fields
  const tasks = tasksData.map(task => ({
    ...task,
    assignee_id: task.assignee_id || null
  }));
  
  return { 
    tasks,
    userRole: userRole as "free" | "individual" | "business"
  };
}
