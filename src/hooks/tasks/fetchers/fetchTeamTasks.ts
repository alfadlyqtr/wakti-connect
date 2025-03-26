
import { supabase } from "@/integrations/supabase/client";
import { TaskWithSharedInfo } from "../types";

export async function fetchTeamTasks(businessId: string): Promise<TaskWithSharedInfo[]> {
  console.log("Team tasks feature has been removed - returning empty array");
  return [];
}
