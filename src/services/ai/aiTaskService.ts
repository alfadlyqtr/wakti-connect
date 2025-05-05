
import { supabase } from "@/integrations/supabase/client";
import { TaskFormData, Task } from "@/types/task.types";
import { mapNestedStructureToFlatSubtasks } from "./subtaskStructureUtils";

/**
 * Creates a task from AI-detected data
 */
export const createAITask = async (taskData: TaskFormData): Promise<Task | null> => {
  try {
    // Get current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("You must be logged in to create tasks");
    }

    // Prepare task data for database
    const taskToCreate = {
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      due_date: taskData.due_date,
      due_time: taskData.due_time,
      location: taskData.location,
      user_id: session.user.id,
      is_recurring: false
    };
    
    console.log("Creating AI-detected task:", taskToCreate);
    
    // Insert the task
    const { data: createdTask, error } = await supabase
      .from('tasks')
      .insert(taskToCreate)
      .select()
      .single();
      
    if (error) throw error;
    
    // Process subtasks based on structure
    if (taskData.subtasks && taskData.subtasks.length > 0) {
      let subtasksToInsert;
      
      if (taskData.preserveNestedStructure && taskData.originalSubtasks) {
        // Use the utility to convert the nested structure to flat subtasks with relationships
        subtasksToInsert = mapNestedStructureToFlatSubtasks(
          taskData.originalSubtasks, 
          createdTask.id
        );
      } else {
        // Traditional flat subtasks
        subtasksToInsert = taskData.subtasks.map(subtask => ({
          task_id: createdTask.id,
          content: subtask.content,
          is_completed: subtask.is_completed || false,
          due_date: subtask.due_date || null,
          due_time: subtask.due_time || null,
          is_group: subtask.is_group || false,
          parent_id: subtask.parent_id || null,
          title: subtask.title || null
        }));
      }
      
      console.log("Creating subtasks:", subtasksToInsert);
      
      // Insert all subtasks
      const { error: subtasksError } = await supabase
        .from('todo_items')
        .insert(subtasksToInsert);
        
      if (subtasksError) {
        console.error("Error inserting subtasks:", subtasksError);
        // Don't throw here - we'll still return the created task
      }
      
      // Create a proper Task object with subtasks included
      const taskResult: Task = {
        ...createdTask,
        status: createdTask.status as Task['status'],
        priority: createdTask.priority as Task['priority'],
        subtasks: subtasksToInsert
      };
      
      return taskResult;
    }
    
    // Return the created task with proper type casting
    return {
      ...createdTask,
      status: createdTask.status as Task['status'],
      priority: createdTask.priority as Task['priority'],
      subtasks: []
    };
  } catch (error) {
    console.error("Error in createAITask:", error);
    throw error;
  }
};

/**
 * Estimates the time to complete a task based on its complexity
 */
export const getEstimatedTaskTime = (subtasksCount: number, priority: string): string => {
  // Base time depends on number of subtasks
  let baseMinutes = 15; // Minimum 15 minutes
  
  if (subtasksCount > 0) {
    baseMinutes += subtasksCount * 10; // 10 minutes per subtask
  }
  
  // Adjust based on priority
  const priorityMultiplier = priority === 'high' || priority === 'urgent' 
    ? 0.8  // High priority tasks might take less time due to focus
    : priority === 'medium' 
      ? 1.0 
      : 1.2; // Low priority tasks might take longer due to less focus
  
  const estimatedMinutes = Math.round(baseMinutes * priorityMultiplier);
  
  // Format the result
  if (estimatedMinutes < 60) {
    return `${estimatedMinutes} minutes`;
  } else {
    const hours = Math.floor(estimatedMinutes / 60);
    const minutes = estimatedMinutes % 60;
    
    if (minutes === 0) {
      return hours === 1 ? "1 hour" : `${hours} hours`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min`;
    }
  }
};
