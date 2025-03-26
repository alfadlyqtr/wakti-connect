
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus, TaskPriority } from "@/types/task.types";

export async function fetchSharedTasks(userId: string): Promise<Task[]> {
  console.log("Shared tasks feature has been removed - returning empty array");
  return [];
}
