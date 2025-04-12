
import { TaskFormData, TaskPriority, SubTask } from "@/types/task.types";

/**
 * Interface for parsed task information from user messages
 */
export interface ParsedTaskInfo {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string;
  dueTime?: string;
  subtasks: string[];
  hasTimeConstraint: boolean;
}

/**
 * Parses natural language to extract task information
 */
export const parseTaskFromMessage = (message: string): ParsedTaskInfo | null => {
  // If the message doesn't seem to be about creating a task, return null
  if (!message.toLowerCase().includes("task") && 
      !message.toLowerCase().includes("todo") && 
      !message.toLowerCase().includes("reminder") &&
      !message.toLowerCase().includes("list") &&
      !message.toLowerCase().includes("shopping")) {
    return null;
  }

  // Try to extract a task title
  let title = "";
  const titleMatches = message.match(/(?:create|add|make|new)\s+(?:a|an)?\s*(?:task|todo|reminder)\s+(?:to|for|about)?\s*["']?([^"'\n.]+)["']?/i);
  
  if (titleMatches && titleMatches[1]) {
    title = titleMatches[1].trim();
  } else {
    // Try a different pattern for title extraction
    const altTitleMatches = message.match(/(?:create|add|make|new)\s+(?:a|an)?\s*(?:task|todo|reminder)\s*(?:called|named|titled)?\s*["']?([^"'\n.]+)["']?/i);
    if (altTitleMatches && altTitleMatches[1]) {
      title = altTitleMatches[1].trim();
    } else {
      // Look for shopping list specifically
      const shoppingListMatch = message.match(/(?:create|add|make|new)\s+(?:a|an)?\s*(?:shopping\s*list)/i);
      if (shoppingListMatch) {
        title = "Shopping List";
      } else {
        // Generic title based on message
        title = "Task from AI Assistant";
      }
    }
  }

  // Extract priority
  let priority: TaskPriority = "normal";
  if (message.toLowerCase().includes("urgent") || 
      message.toLowerCase().includes("high priority") || 
      message.toLowerCase().includes("important")) {
    priority = "urgent";
  } else if (message.toLowerCase().includes("medium priority")) {
    priority = "medium";
  }

  // Parse due date and time
  let dueDate: string | undefined;
  let dueTime: string | undefined;
  let hasTimeConstraint = false;

  // Check for timeframes mentioned in the message
  if (message.toLowerCase().includes("due today") || 
      message.toLowerCase().includes("by today") ||
      message.toLowerCase().includes("for today")) {
    const today = new Date();
    dueDate = today.toISOString().split('T')[0];
    hasTimeConstraint = true;
  } else if (message.toLowerCase().includes("due tomorrow") || 
             message.toLowerCase().includes("by tomorrow") ||
             message.toLowerCase().includes("for tomorrow")) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dueDate = tomorrow.toISOString().split('T')[0];
    hasTimeConstraint = true;
  } else if (message.toLowerCase().includes("hour") || 
             message.toLowerCase().includes("hr")) {
    // Due in X hours
    const hourMatches = message.match(/(\d+)\s*(?:hour|hr)/i);
    if (hourMatches && hourMatches[1]) {
      const hours = parseInt(hourMatches[1]);
      const dueDateTime = new Date();
      dueDateTime.setHours(dueDateTime.getHours() + hours);
      
      dueDate = dueDateTime.toISOString().split('T')[0];
      dueTime = dueDateTime.toTimeString().substring(0, 5);
      hasTimeConstraint = true;
    } else {
      // Just "in an hour" or similar
      const dueDateTime = new Date();
      dueDateTime.setHours(dueDateTime.getHours() + 1);
      
      dueDate = dueDateTime.toISOString().split('T')[0];
      dueTime = dueDateTime.toTimeString().substring(0, 5);
      hasTimeConstraint = true;
    }
  }

  // Extract subtasks
  const subtasks: string[] = [];
  
  // Look for list patterns
  // - item
  // * item
  // 1. item
  // item 1)
  // item 1.
  const listMatches = message.match(/(?:^|\n)(?:[-*]\s|\d+[.)]?\s)(.+)(?=\n|$)/gm);
  if (listMatches) {
    listMatches.forEach(item => {
      const text = item.replace(/^(?:[-*]\s|\d+[.)]?\s)/, '').trim();
      if (text && !text.toLowerCase().includes("task") && !text.toLowerCase().includes("todo")) {
        subtasks.push(text);
      }
    });
  }
  
  // If no list format, look for keywords like "subtasks" followed by text items
  if (subtasks.length === 0) {
    const subtaskSectionRegex = /(?:subtasks?|items?|things?|steps?|list|shopping\slist)(?:\s*(?:are|include|:|is|should\s*be|contains?|with))?\s*(?:(?:\s*(?:and|,|-|•)?\s*([^,\n]+))+)/i;
    const match = message.match(subtaskSectionRegex);
    
    if (match && match[0]) {
      const section = match[0];
      // Split by commas, ands, or certain punctuation
      const items = section.split(/(?:,|\sand\s|;|\n|\s*-\s*|\s*•\s*)/);
      
      // Filter out the header text and empty items
      items.forEach(item => {
        const cleaned = item.trim();
        if (cleaned && 
            !cleaned.toLowerCase().includes("subtask") && 
            !cleaned.toLowerCase().includes("list") &&
            !cleaned.match(/^(?:are|include|:|is|should\s*be|contains?|with)$/i)) {
          subtasks.push(cleaned);
        }
      });
    }
  }

  // Extract description (anything not matched by other fields)
  let description = "";
  const descriptionMatch = message.match(/(?:description|note|details)\s*(?::|is|are)?\s*(.+?)(?=\n|$)/i);
  if (descriptionMatch && descriptionMatch[1]) {
    description = descriptionMatch[1].trim();
  }

  return {
    title,
    description,
    priority,
    dueDate,
    dueTime,
    subtasks,
    hasTimeConstraint
  };
};

/**
 * Convert parsed task info to form data for task creation
 */
export const convertParsedTaskToFormData = (parsedTask: ParsedTaskInfo): TaskFormData => {
  // Create properly shaped SubTask objects with required type shape
  const subtasksWithType: SubTask[] = parsedTask.subtasks.map((content, index) => ({
    id: `temp-id-${index}`, // Temporary ID for type matching
    task_id: 'pending', // Will be assigned when task is created
    content,
    is_completed: false
  }));
  
  return {
    title: parsedTask.title,
    description: parsedTask.description,
    priority: parsedTask.priority,
    due_date: parsedTask.dueDate,
    due_time: parsedTask.dueTime,
    subtasks: subtasksWithType
  };
};

