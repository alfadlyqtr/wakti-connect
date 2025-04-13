
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

export interface ParsedTask {
  title: string;
  due_date: string | null;
  due_time: string | null;
  priority: 'urgent' | 'high' | 'medium' | 'normal';
  subtasks: string[];
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
    
    return data as ParsedTask;
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
 * Converts ParsedTask to TaskFormData for task creation
 */
export const convertParsedTaskToFormData = (parsedTask: ParsedTask) => {
  // Convert subtasks to the format expected by the task form
  const subtasks = parsedTask.subtasks.map((content, index) => ({
    id: `temp-${index}`,
    task_id: 'pending',
    content,
    is_completed: false
  }));
  
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
    subtasks: subtasks,
    status: 'pending',
    location: parsedTask.location,
    enableSubtasks: subtasks.length > 0,
    is_recurring: false
  };
};
