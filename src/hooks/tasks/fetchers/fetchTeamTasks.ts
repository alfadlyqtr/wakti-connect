
import { supabase } from "@/integrations/supabase/client";
import { TaskWithSharedInfo } from "../types";

/**
 * This is a stub function now that team tasks feature has been removed.
 * It returns an empty array but keeps the API consistent for any code that might call it.
 */
export async function fetchTeamTasks(businessId: string): Promise<TaskWithSharedInfo[]> {
  console.log("Team tasks feature has been removed - returning empty array");
  return [];
}
