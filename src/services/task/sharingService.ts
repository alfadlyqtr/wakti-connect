
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/task.types";

// This is a stub since sharing has been removed
export const shareTask = async (taskId: string, userId: string): Promise<void> => {
  console.log("Task sharing has been removed");
  throw new Error("Task sharing functionality has been removed");
};

export const unshareTask = async (taskId: string, userId: string): Promise<void> => {
  console.log("Task sharing has been removed");
  throw new Error("Task sharing functionality has been removed");
};

export const getTaskSharedUsers = async (taskId: string): Promise<string[]> => {
  return [];
};
