
import { supabase } from "@/integrations/supabase/client";
import { TaskWithSharedInfo } from "../types";

/**
 * This is a stub function now that assigned tasks feature has been removed.
 * It returns an empty array but keeps the API consistent for any code that might call it.
 */
export async function fetchAssignedTasks(userId: string, includeTeamTasks = false): Promise<TaskWithSharedInfo[]> {
  console.log("Assigned tasks feature has been removed - returning empty array");
  return [];
}
