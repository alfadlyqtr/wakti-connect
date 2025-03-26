
import { Task } from "@/types/task.types";

// Stub for removed sharing functionality
export async function shareTask(taskId: string, userEmail: string): Promise<boolean> {
  console.log("Task sharing feature has been removed");
  return false;
}

// Stub for removed assignment functionality
export async function assignTask(taskId: string, staffId: string): Promise<boolean> {
  console.log("Task assignment feature has been removed");
  return false;
}
