
import { supabase } from "@/integrations/supabase/client";
import { TaskWithSharedInfo } from "../types";

export async function fetchAssignedTasks(userId: string, includeTeamTasks = false): Promise<TaskWithSharedInfo[]> {
  console.log("Assigned tasks feature has been removed - returning empty array");
  return [];
}
