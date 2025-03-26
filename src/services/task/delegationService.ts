
import { toast } from '@/components/ui/use-toast';

/**
 * Delegate a task to another user or via email
 * This functionality is currently disabled
 */
export async function delegateTask(
  taskId: string,
  userId?: string,
  email?: string
): Promise<void> {
  try {
    console.log("Task delegation functionality is disabled");
    
    toast({
      title: "Task delegation disabled",
      description: "Task delegation functionality is currently not available",
      variant: "default",
    });
    
    throw new Error("Task delegation functionality is not available at this time");
  } catch (error) {
    console.error("Error delegating task:", error);
    toast({
      title: "Failed to delegate task",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    throw error;
  }
}
