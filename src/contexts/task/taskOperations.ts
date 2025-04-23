import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus, TaskPriority } from "@/types/task.types";
import { toast } from "@/components/ui/use-toast";
import { validateTaskStatus, validateTaskPriority } from "@/services/task/utils/statusValidator";
import { mapDbTaskToTyped, checkTasksTableExists } from "./taskUtils";
import { getMockTasks } from "./taskConstants";

// Fetch tasks from Supabase
export const fetchTasks = async (includeArchived: boolean = false): Promise<Task[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    console.log("No active session, skipping task fetch");
    return [];
  }
  
  const tableExists = await checkTasksTableExists();
    
  if (!tableExists) {
    console.log("Using mock task data until table is created");
    return getMockTasks();
  }
  
  try {
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    // Only include non-archived tasks by default
    if (!includeArchived) {
      query = query.is('archived_at', null);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
    
    const typedTasks: Task[] = (data || []).map(mapDbTaskToTyped);
    return typedTasks;
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
    return getMockTasks();
  }
};

// Add a new task
export const addTask = async (task: Omit<Task, "id">): Promise<Task> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("No active session");
  }
  
  const newTask = {
    ...task,
    user_id: session.user.id,
    status: validateTaskStatus(task.status),
    priority: validateTaskPriority(task.priority),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    due_time: task.due_time || null,
    completed_at: task.completed_at || null,
    is_recurring_instance: task.is_recurring_instance || false,
    parent_recurring_id: task.parent_recurring_id || null,
    snooze_count: task.snooze_count || 0,
    snoozed_until: task.snoozed_until || null
  };

  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert(newTask)
      .select('*')
      .single();
      
    if (error) throw error;
    
    const typedTask: Task = mapDbTaskToTyped(data);
    
    toast({
      title: "Task created",
      description: "Your task has been created successfully.",
    });
    
    return typedTask;
    
  } catch (err) {
    console.error("Error adding task to Supabase:", err);
    
    // Create a mock task with generated ID for local mode
    const mockTask: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      status: validateTaskStatus(newTask.status),
      priority: validateTaskPriority(newTask.priority)
    };
    
    toast({
      title: "Task created (local only)",
      description: "Your task has been created in local mode.",
    });
    
    return mockTask;
  }
};

// Update an existing task
export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  const validatedUpdates = {
    ...updates,
    status: updates.status ? validateTaskStatus(updates.status) : undefined,
    priority: updates.priority ? validateTaskPriority(updates.priority) : undefined,
    updated_at: new Date().toISOString()
  };

  try {
    const { error } = await supabase
      .from('tasks')
      .update(validatedUpdates)
      .eq('id', id);
      
    if (error) throw error;
    
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    });
    
    // Return the updated task (need to fetch or reconstruct)
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
      
    return mapDbTaskToTyped(data);
    
  } catch (error) {
    console.error("Error updating task in Supabase:", error);
    
    toast({
      title: "Task updated (local only)",
      description: "Your task has been updated in local mode.",
    });
    
    // Return a mock updated task
    return {
      id,
      ...validatedUpdates
    } as Task;
  }
};

// Delete a task immediately
export const deleteTask = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast({
      title: "Task deleted",
      description: "Task has been permanently deleted",
    });
    
  } catch (error) {
    console.error("Error deleting task:", error);
    
    toast({
      title: "Delete failed",
      description: "Failed to delete task. Please try again.",
      variant: "destructive"
    });
    
    throw error;
  }
};

// Mark a task as completed
export const completeTask = async (id: string): Promise<void> => {
  await updateTask(id, { 
    status: "completed" as TaskStatus,
    completed_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  toast({
    title: "Task completed",
    description: "Your task has been marked as completed.",
  });
};
