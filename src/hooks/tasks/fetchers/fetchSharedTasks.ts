
import { supabase } from "@/integrations/supabase/client";
import { TaskWithSharedInfo } from "../types";

export async function fetchSharedTasks(userId: string): Promise<TaskWithSharedInfo[]> {
  console.log("Shared tasks feature has been removed - returning empty array");
  return [];
}
