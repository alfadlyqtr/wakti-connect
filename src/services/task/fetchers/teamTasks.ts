
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus, TaskPriority } from "@/types/task.types";

export async function fetchTeamTasks(businessId: string): Promise<Task[]> {
  console.log("Team tasks feature has been removed - returning empty array");
  return [];
}
