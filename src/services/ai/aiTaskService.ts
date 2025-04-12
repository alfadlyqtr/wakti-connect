
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskFormData } from "@/types/task.types";
import { createTask } from "@/services/task/createService";
import { toast } from "@/components/ui/use-toast";
import { ParsedTaskInfo } from "@/hooks/ai/utils/taskParser";

/**
 * Creates a task based on AI-parsed information
 */
export const createAITask = async (taskData: TaskFormData): Promise<Task | null> => {
  try {
    console.log("Creating AI-generated task:", taskData);
    
    // Get current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Authentication required to create tasks");
    }
    
    // Create the task using the existing service
    const createdTask = await createTask(taskData);
    
    // Return the created task
    return createdTask;
  } catch (error) {
    console.error("Error creating AI task:", error);
    
    toast({
      title: "Error creating task",
      description: error instanceof Error ? error.message : "Failed to create task",
      variant: "destructive",
    });
    
    return null;
  }
};

/**
 * Get estimated task completion time based on subtasks
 */
export const getEstimatedTaskTime = (parsedTask: ParsedTaskInfo): string => {
  const subtaskCount = parsedTask.subtasks.length;
  
  if (subtaskCount === 0) {
    return "a few minutes";
  } else if (subtaskCount <= 3) {
    return "about 15 minutes";
  } else if (subtaskCount <= 6) {
    return "about 30 minutes";
  } else {
    return "about 1 hour";
  }
};
