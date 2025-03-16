
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
  
  // Declare variable to hold tasks data
  let tasksData: any[] = [];
  
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
      
      // Extract just the tasks objects from the response
      tasksData = [];
      if (data && data.length > 0) {
        for (const item of data) {
          if (item.tasks) {
            // Create a new object instead of passing the reference
            const taskCopy = { 
              id: item.tasks.id,
              title: item.tasks.title,
              description: item.tasks.description,
              status: item.tasks.status,
              priority: item.tasks.priority,
              due_date: item.tasks.due_date,
              user_id: item.tasks.user_id,
              assignee_id: item.tasks.assignee_id,
              created_at: item.tasks.created_at,
              updated_at: item.tasks.updated_at
            };
            tasksData.push(taskCopy);
          }
        }
      }
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
  
  // Process and normalize the tasks with default values for missing fields
  const normalizedTasks: Task[] = [];
  
  for (const task of tasksData) {
    normalizedTasks.push({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status || "pending",
      priority: task.priority || "normal",
      due_date: task.due_date,
      user_id: task.user_id,
      assignee_id: task.assignee_id || null,
      created_at: task.created_at,
      updated_at: task.updated_at
    });
  }
  
  return { 
    tasks: normalizedTasks,
    userRole: userRole as "free" | "individual" | "business"
  };
}
