
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
  location?: string;
  hasTimeConstraint: boolean;
  needsReview: boolean;
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
  let needsReview = false;
  
  // Check explicit priority indications
  if (message.toLowerCase().includes("urgent") || 
      message.toLowerCase().includes("high priority") || 
      message.toLowerCase().includes("important") ||
      message.toLowerCase().includes("asap") ||
      message.toLowerCase().includes("as soon as possible") ||
      message.toLowerCase().includes("right away") ||
      message.toLowerCase().includes("immediately")) {
    priority = "urgent";
  } else if (message.toLowerCase().includes("medium priority")) {
    priority = "medium";
  } else {
    // Check context clues for urgency
    const urgencyClues = [
      /before\s+(?:lunch|dinner|breakfast|noon|evening)/i,
      /need\s+(?:it|this)\s+(?:done|completed|finished)\s+(?:today|this\s+evening|tonight|this\s+morning)/i,
      /(?:by|until)\s+(?:the\s+end\s+of\s+(?:today|the\s+day|this\s+afternoon|business\s+hours))/i,
      /due\s+(?:today|in\s+a\s+few\s+hours)/i
    ];
    
    if (urgencyClues.some(clue => message.match(clue))) {
      priority = "high";
    } else {
      // If no explicit priority or urgency clues are found, suggest review
      needsReview = true;
    }
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
  
  // Check for specific time like "at noon" or "5pm"
  const timePatterns = [
    { regex: /at\s+noon/i, time: "12:00" },
    { regex: /at\s+midnight/i, time: "00:00" },
    { regex: /at\s+(\d+)(?::(\d+))?\s*(am|pm)/i, formatter: (matches: RegExpMatchArray) => {
      let hours = parseInt(matches[1]);
      const minutes = matches[2] ? parseInt(matches[2]) : 0;
      const period = matches[3].toLowerCase();
      
      if (period === "pm" && hours < 12) hours += 12;
      if (period === "am" && hours === 12) hours = 0;
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }}
  ];
  
  for (const pattern of timePatterns) {
    const matches = message.match(pattern.regex);
    if (matches) {
      dueTime = typeof pattern.time === 'string' ? pattern.time : pattern.formatter(matches);
      hasTimeConstraint = true;
      
      // If we have a time but no date, assume it's for today
      if (!dueDate) {
        const today = new Date();
        dueDate = today.toISOString().split('T')[0];
      }
      
      break;
    }
  }

  // Extract location information
  let location: string | undefined;
  const locationPatterns = [
    /(?:at|in|near|by|@)\s+(?:the\s+)?([A-Z][a-zA-Z\s]+(?:Center|Mall|Plaza|Building|Park|Office|Store|Shop|Market|Restaurant|Café|Cafe|Hotel|Airport|Station))/,
    /(?:at|in|near|by|@)\s+(?:the\s+)?([A-Z][a-zA-Z\s]+(?:Street|Avenue|Road|Lane|Drive|Place|Boulevard|Highway|Freeway))/,
    /location:?\s+([^,;\n]+)/i,
    /(?:at|in|near|by|@)\s+([A-Z][a-zA-Z0-9\s]+(?:, [A-Z][a-zA-Z]+)?)/
  ];
  
  for (const pattern of locationPatterns) {
    const matches = message.match(pattern);
    if (matches && matches[1]) {
      location = matches[1].trim();
      break;
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
    location,
    hasTimeConstraint,
    needsReview
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
    description: parsedTask.description ? parsedTask.description : (parsedTask.location ? `Location: ${parsedTask.location}` : undefined),
    priority: parsedTask.priority,
    due_date: parsedTask.dueDate,
    due_time: parsedTask.dueTime,
    subtasks: subtasksWithType,
    location: parsedTask.location
  };
};

/**
 * Generate a human-readable description of a task for confirmation
 */
export const generateTaskConfirmationText = (taskInfo: ParsedTaskInfo): string => {
  let confirmationText = `Task: ${taskInfo.title}`;
  
  if (taskInfo.priority) {
    confirmationText += ` (${taskInfo.priority} priority)`;
  }
  
  if (taskInfo.location) {
    confirmationText += ` at ${taskInfo.location}`;
  }
  
  if (taskInfo.dueDate) {
    const date = new Date(taskInfo.dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      confirmationText += ` due today`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      confirmationText += ` due tomorrow`;
    } else {
      confirmationText += ` due on ${date.toLocaleDateString()}`;
    }
    
    if (taskInfo.dueTime) {
      confirmationText += ` at ${taskInfo.dueTime}`;
    }
  }
  
  if (taskInfo.subtasks && taskInfo.subtasks.length > 0) {
    confirmationText += `\nSubtasks: ${taskInfo.subtasks.join(', ')}`;
  }
  
  return confirmationText + "\n\nSay 'Go', 'Do it', 'Yes', or 'Sure' to confirm.";
};
