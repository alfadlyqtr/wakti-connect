
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus, TaskPriority } from "@/types/task.types";

export async function fetchAssignedTasks(userId: string, isBusiness: boolean = false): Promise<Task[]> {
  console.log("Assigned tasks feature has been removed - returning empty array");
  return [];
}
