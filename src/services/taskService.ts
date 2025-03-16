
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskTab, TaskFormData, TasksResult } from "@/types/task.types";

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
  
  let query;
  
  switch (tab) {
    case "my-tasks":
      // User's own tasks
      query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .order('due_date', { ascending: true });
      break;
      
    case "shared-tasks":
      // Tasks shared with the user
      query = supabase
        .from('shared_tasks')
        .select('task_id, tasks(*)')
        .eq('shared_with', session.user.id)
        .order('created_at', { ascending: false });
      break;
      
    case "assigned-tasks":
      // Tasks assigned to the user (for staff members)
      query = supabase
        .from('tasks')
        .select('*')
        .eq('assignee_id', session.user.id)
        .order('due_date', { ascending: true });
      break;
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error(`Error fetching ${tab}:`, error);
    throw error;
  }
  
  // Transform shared tasks data if needed
  let transformedData;
  if (tab === "shared-tasks") {
    transformedData = data.map((item: any) => item.tasks);
  } else {
    transformedData = data;
  }
  
  return { 
    tasks: transformedData as Task[],
    userRole
  };
}

// Create a new task
export async function createTask(taskData: TaskFormData): Promise<Task> {
  // Get current user
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Authentication required to create tasks");
  }

  const newTask = {
    user_id: session.user.id,
    title: taskData.title || "New Task",
    description: taskData.description || "",
    status: taskData.status || "pending",
    priority: taskData.priority || "normal",
    due_date: taskData.due_date || new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    assignee_id: taskData.assignee_id || null
  };

  const { data, error } = await supabase
    .from('tasks')
    .insert(newTask)
    .select();

  if (error) {
    throw error;
  }
  
  return data[0] as Task;
}

// Share a task with another user
export async function shareTask(taskId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('shared_tasks')
    .insert({
      task_id: taskId,
      shared_with: userId
    });

  if (error) throw error;

  return true;
}

// Assign a task to a staff member
export async function assignTask(taskId: string, staffId: string): Promise<boolean> {
  const { error } = await supabase
    .from('tasks')
    .update({ assignee_id: staffId })
    .eq('id', taskId);

  if (error) throw error;

  return true;
}
