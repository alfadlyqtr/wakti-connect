
import { supabase } from "@/integrations/supabase/client";
import { TaskTab, TasksResult, Task, TaskStatus, TaskPriority } from "./types";

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
      
      // Transform data to ensure it has all Task properties with proper typing
      tasksData = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        status: (item.status || "pending") as TaskStatus,
        priority: (item.priority || "normal") as TaskPriority,
        due_date: item.due_date,
        user_id: item.user_id,
        assignee_id: item.assignee_id || null,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
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
            const task = item.tasks;
            // Create a new object with explicit property assignments and proper type casting
            tasksData.push({
              id: task.id,
              title: task.title,
              description: task.description,
              status: (task.status || "pending") as TaskStatus,
              priority: (task.priority || "normal") as TaskPriority,
              due_date: task.due_date,
              user_id: task.user_id,
              assignee_id: task.assignee_id || null,
              created_at: task.created_at,
              updated_at: task.updated_at
            });
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
      
      // Transform data with proper typing
      tasksData = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        status: (item.status || "pending") as TaskStatus,
        priority: (item.priority || "normal") as TaskPriority,
        due_date: item.due_date,
        user_id: item.user_id,
        assignee_id: item.assignee_id || null,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
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
      
      // Transform data with proper typing
      tasksData = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        status: (item.status || "pending") as TaskStatus,
        priority: (item.priority || "normal") as TaskPriority,
        due_date: item.due_date,
        user_id: item.user_id,
        assignee_id: item.assignee_id || null,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      break;
    }
  }
  
  return { 
    tasks: tasksData,
    userRole: userRole as "free" | "individual" | "business"
  };
}
