
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskFormData } from "./types";
import { createNewTask } from "./baseService";

// Create a new task
export async function createTask(taskData: TaskFormData): Promise<Task> {
  // Get current user
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Authentication required to create tasks");
  }

  // Create the new task using the base service
  return await createNewTask(session.user.id, taskData);
}
