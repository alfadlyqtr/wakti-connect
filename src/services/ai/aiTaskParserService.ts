
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { SubTask } from "@/types/task.types";
import { v4 as uuidv4 } from "uuid";
import { mapNestedStructureToFlatSubtasks } from "./subtaskStructureUtils";

export interface NestedSubtask {
  title?: string;
  content?: string;
  subtasks?: (NestedSubtask | string)[];
  is_completed?: boolean;
}

export interface ParsedTask {
  title: string;
  due_date: string | null;
  due_time: string | null;
  priority: 'urgent' | 'high' | 'medium' | 'normal';
  subtasks: (string | NestedSubtask)[]; // Support both flat and nested structures
  location: string | null;
}

/**
 * Parses a text input into a structured task using AI
 */
export const parseTaskWithAI = async (text: string): Promise<ParsedTask | null> => {
  try {
    console.log("Sending text to AI parser:", text);
    
    const { data, error } = await supabase.functions.invoke('ai-task-parser', {
      body: { text }
    });
    
    if (error) {
      console.error("Error calling AI task parser:", error);
      throw new Error(error.message || "Failed to parse task");
    }
    
    if (!data || !data.title) {
      console.error("Invalid response from AI task parser:", data);
      throw new Error("No valid task information returned");
    }
    
    console.log("Successfully parsed task with AI:", data);
    
    // Return the parsed task with its potentially nested subtask structure intact
    return {
      title: data.title,
      due_date: data.due_date,
      due_time: data.due_time,
      priority: data.priority || 'normal',
      subtasks: Array.isArray(data.subtasks) ? data.subtasks : [],
      location: data.location
    };
  } catch (error) {
    console.error("Error parsing task with AI:", error);
    
    toast({
      title: "Task parsing failed",
      description: error instanceof Error ? error.message : "Failed to understand the task",
      variant: "destructive",
    });
    
    return null;
  }
};

/**
 * Helper function to flatten nested subtask structures if needed
 * This is kept for backward compatibility but we now preserve the nested structure
 */
export const flattenSubtasks = (subtasks: (string | NestedSubtask)[]): string[] => {
  let flattened: string[] = [];
  
  for (const item of subtasks) {
    if (typeof item === 'string') {
      flattened.push(item);
    } else if (typeof item === 'object' && item !== null) {
      // Handle case where subtask is an object with a title and children
      if (item.title) {
        flattened.push(item.title);
      }
      
      if (item.content) {
        flattened.push(item.content);
      }
      
      // Recursively flatten nested subtasks
      if (Array.isArray(item.subtasks)) {
        flattened = flattened.concat(flattenSubtasks(item.subtasks));
      }
    }
  }
  
  return flattened;
};

/**
 * Converts a nested subtask structure to SubTask[] format
 */
export const convertNestedSubtasksToSubTasks = (
  nestedItems: (string | NestedSubtask)[],
  parentId: string | null = null
): SubTask[] => {
  return nestedItems.map((item, index) => {
    const tempId = uuidv4(); // Using proper UUID for subtask IDs
    
    if (typeof item === 'string') {
      return {
        id: tempId,
        task_id: 'pending', // Will be replaced with actual task_id
        content: item,
        is_completed: false,
        parent_id: parentId,
        is_group: false
      };
    } else {
      // This is a group/nested item
      const isGroup = item.subtasks && item.subtasks.length > 0;
      const title = item.title || item.content || 'Group';
      
      const subtask: SubTask = {
        id: tempId,
        task_id: 'pending',
        content: title,
        title: title, // Store title separately for clarity
        is_completed: item.is_completed || false,
        is_group: isGroup,
        parent_id: parentId,
        subtasks: []
      };
      
      // Process child subtasks if they exist
      if (isGroup && item.subtasks) {
        subtask.subtasks = convertNestedSubtasksToSubTasks(item.subtasks, tempId);
      }
      
      return subtask;
    }
  });
};

/**
 * Converts ParsedTask to TaskFormData for task creation
 * Handles both flat and nested subtask structures
 */
export const convertParsedTaskToFormData = (parsedTask: ParsedTask) => {
  // Preserve the original subtask structure but also create a flattened version
  // for backward compatibility with forms
  const flatSubtasks = flattenSubtasks(parsedTask.subtasks);
  
  // Convert subtasks to the format expected by the task form
  const simpleSubtasks = flatSubtasks.map((content) => ({
    id: uuidv4(), // Using proper UUID for subtask IDs
    task_id: 'pending',
    content,
    is_completed: false
  }));
  
  // Convert nested structure to SubTask[] format
  const hierarchicalSubtasks = convertNestedSubtasksToSubTasks(parsedTask.subtasks);
  
  // Convert priority from ParsedTask format to TaskFormData format
  let priority: 'urgent' | 'high' | 'medium' | 'normal' = 'normal';
  if (parsedTask.priority === 'urgent') {
    priority = 'urgent';
  } else if (parsedTask.priority === 'high') {
    priority = 'high';
  } else if (parsedTask.priority === 'medium') {
    priority = 'medium';
  }
  
  return {
    title: parsedTask.title,
    description: parsedTask.location 
      ? `Location: ${parsedTask.location}` 
      : '',
    priority,
    due_date: parsedTask.due_date,
    due_time: parsedTask.due_time,
    subtasks: hierarchicalSubtasks,
    status: 'pending',
    location: parsedTask.location,
    enableSubtasks: parsedTask.subtasks.length > 0,
    is_recurring: false,
    // Store the original nested subtask structure for display in TaskCard
    originalSubtasks: parsedTask.subtasks,
    preserveNestedStructure: true
  };
};
