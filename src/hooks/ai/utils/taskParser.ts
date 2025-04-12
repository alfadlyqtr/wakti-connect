
import { TaskFormData, TaskPriority, SubTask } from "@/types/task.types";

export interface ParsedTaskInfo {
  title: string;
  description?: string;
  due_date?: string | Date | null;
  priority?: TaskPriority;
  location?: string | null;
  subtasks: string[];
  // Additional fields for UI presentation
  hasTimeConstraint?: boolean;
  needsReview?: boolean;
  dueTime?: string | null;
}

/**
 * Parses natural language text to extract task information
 */
export function parseTaskFromMessage(text: string): ParsedTaskInfo | null {
  if (!text || typeof text !== 'string') {
    return null;
  }
  
  // Check if the message is about creating a task
  const taskIntentRegex = /(?:create|add|make|set up|schedule|remind me to|new) (?:a |an )?(?:task|to-do|todo|reminder|appointment|event)/i;
  
  // If not explicitly asking to create a task, check for task-like phrases
  const taskPhraseRegex = /(?:i need to|i have to|i want to|i should|need to|let's|let me|should|must|going to)/i;
  
  // Common date/time expressions
  const todayRegex = /(?:today|this evening|tonight|this afternoon|this morning)/i;
  const tomorrowRegex = /(?:tomorrow|next day)/i;
  const weekdayRegex = /(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i;
  const timeRegex = /(?:at|by|before|after)?\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.|a|p)?)/i;
  
  // Priority expressions
  const highPriorityRegex = /(?:urgent|high priority|important|critical|asap|right away|immediately|vital)/i;
  const mediumPriorityRegex = /(?:medium priority|normal priority|moderate|somewhat important)/i;
  const lowPriorityRegex = /(?:low priority|not urgent|can wait|whenever|no rush)/i;
  
  // Location expressions
  const locationRegex = /(?:at|in|near|by)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g;
  const atLocationRegex = /at\s+([A-Z][a-zA-Z0-9\s]+(?:\s+[A-Z][a-zA-Z0-9\s]+)*)/i;
  
  // Extract location with flexibility for places like "Doha Festival City"
  const extractLocation = (text: string): string | undefined => {
    // Check for "at [Location]" pattern
    const atMatch = text.match(atLocationRegex);
    if (atMatch && atMatch[1]) {
      return atMatch[1].trim();
    }
    
    // Try to find location mentions
    let locationMatches = [];
    let match;
    while ((match = locationRegex.exec(text)) !== null) {
      locationMatches.push(match[1]);
    }
    
    // Return the first location found or undefined
    return locationMatches.length > 0 ? locationMatches[0] : undefined;
  };
  
  // Is this a task creation intent?
  const hasTaskIntent = taskIntentRegex.test(text) || taskPhraseRegex.test(text);
  
  if (!hasTaskIntent) {
    return null;
  }
  
  // Extract potential task title - first sentence or segment before date/time/priority indicators
  const titleMatch = text.match(/(?:create|add|make|set up|schedule|remind me to|new|i need to|i have to|i want to|i should|need to|let's|let me|should|must|going to)\s+(?:a |an )?(?:task|to-do|todo|reminder|appointment|event)?\s*(?:to|about|for|about|:)?\s*([^.,!?;]+)/i);
  
  let title = '';
  
  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1].trim();
  } else {
    // Fallback - use first part of text
    const firstSegment = text.split(/[.,!?;]/)[0];
    title = firstSegment.trim();
  }
  
  // Clean up title
  title = title.replace(/^(to|about|for|about|:)\s+/i, '');
  
  // Handle "with" in title
  const withIndex = title.indexOf(' with ');
  if (withIndex > 0) {
    title = title.substring(0, withIndex);
  }
  
  // Extract priority
  let priority: TaskPriority = 'medium';
  if (highPriorityRegex.test(text)) {
    priority = 'high';
  } else if (mediumPriorityRegex.test(text)) {
    priority = 'medium';
  } else if (lowPriorityRegex.test(text)) {
    priority = 'normal'; // Using 'normal' instead of 'low' to match TaskPriority type
  }
  
  // Extract due date
  let dueDate: Date | undefined;
  let dueTime: string | undefined;
  
  if (todayRegex.test(text)) {
    dueDate = new Date();
    
    // If "tonight" is mentioned, set to 9 PM today
    if (/tonight/.test(text)) {
      dueDate.setHours(21, 0, 0, 0);
      dueTime = '9:00 PM';
    } else if (/this evening/.test(text)) {
      dueDate.setHours(18, 0, 0, 0);
      dueTime = '6:00 PM';
    } else if (/this afternoon/.test(text)) {
      dueDate.setHours(15, 0, 0, 0);
      dueTime = '3:00 PM';
    } else if (/this morning/.test(text)) {
      dueDate.setHours(9, 0, 0, 0);
      dueTime = '9:00 AM';
    }
  } else if (tomorrowRegex.test(text)) {
    dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);
    dueDate.setHours(9, 0, 0, 0); // Default to morning
    dueTime = '9:00 AM';
  } else if (weekdayRegex.test(text)) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date();
    const todayDay = today.getDay();
    
    const dayMatch = text.match(weekdayRegex);
    if (dayMatch) {
      const targetDay = days.indexOf(dayMatch[0].toLowerCase());
      
      if (targetDay !== -1) {
        const daysToAdd = (targetDay - todayDay + 7) % 7;
        dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + (daysToAdd === 0 ? 7 : daysToAdd));
        dueDate.setHours(9, 0, 0, 0); // Default to morning
        dueTime = '9:00 AM';
      }
    }
  }
  
  // Try to extract specific time
  const timeMatch = text.match(timeRegex);
  if (timeMatch && timeMatch[1] && dueDate) {
    const timeStr = timeMatch[1].toLowerCase();
    let hours = 0;
    let minutes = 0;
    
    // Parse time formats like "3pm", "3:30pm", "15:00"
    if (timeStr.includes(':')) {
      const [hoursStr, minutesWithAmPm] = timeStr.split(':');
      hours = parseInt(hoursStr, 10);
      
      if (minutesWithAmPm.includes('pm') || minutesWithAmPm.includes('p.m.') || minutesWithAmPm.includes('p')) {
        if (hours < 12) hours += 12;
      } else if ((minutesWithAmPm.includes('am') || minutesWithAmPm.includes('a.m.') || minutesWithAmPm.includes('a')) && hours === 12) {
        hours = 0;
      }
      
      minutes = parseInt(minutesWithAmPm.replace(/[^\d]/g, ''), 10);
    } else {
      // Handle formats like "3pm"
      let hoursStr = timeStr.replace(/[^\d]/g, '');
      hours = parseInt(hoursStr, 10);
      
      if (timeStr.includes('pm') || timeStr.includes('p.m.') || timeStr.includes('p')) {
        if (hours < 12) hours += 12;
      } else if ((timeStr.includes('am') || timeStr.includes('a.m.') || timeStr.includes('a')) && hours === 12) {
        hours = 0;
      }
    }
    
    dueDate.setHours(hours, minutes, 0, 0);
    
    // Format time for display (12-hour format)
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    dueTime = `${displayHours}:${displayMinutes} ${period}`;
  }
  
  // Extract location
  const location = extractLocation(text);
  
  // Extract subtasks
  const subtasks: string[] = [];
  
  // Look for list indicators
  const bulletPoints = text.match(/(?:^|\n)[\s-]*([^\n-][^\n]+)/gm);
  if (bulletPoints && bulletPoints.length > 1) {
    // Skip the first item as it's likely the main task
    for (let i = 1; i < bulletPoints.length; i++) {
      const subtask = bulletPoints[i].replace(/^[\s-]*/, '').trim();
      if (subtask && subtask.length > 2) {
        subtasks.push(subtask);
      }
    }
  }
  
  // Look for "with" or "including" phrases that might contain subtasks
  const withMatch = text.match(/(?:with|including|containing|having|containing items like|such as)\s+([^.,!?;]+)/i);
  if (withMatch && withMatch[1]) {
    const withList = withMatch[1].split(/\s+and\s+|\s*,\s*/);
    withList.forEach(item => {
      const subtask = item.trim();
      if (subtask && subtask.length > 2 && !subtasks.includes(subtask)) {
        subtasks.push(subtask);
      }
    });
  }
  
  // Create a basic description
  let description = '';
  
  if (subtasks.length > 0) {
    description = `Task with ${subtasks.length} items: ${subtasks.join(', ')}`;
  }
  
  if (location) {
    description += description ? ` at ${location}` : `At ${location}`;
  }
  
  if (dueDate) {
    const dateStr = dueDate.toLocaleString();
    description += description ? `. Due ${dateStr}` : `Due ${dateStr}`;
  }
  
  // Add priority if not medium
  if (priority !== 'medium') {
    description += description ? `. ${priority.toUpperCase()} priority` : `${priority.toUpperCase()} priority task`;
  }
  
  // Determine if task has time constraints
  const hasTimeConstraint = dueDate !== undefined && (
    todayRegex.test(text) || 
    timeMatch !== null || 
    /urgent|asap|immediately|right away/.test(text.toLowerCase())
  );
  
  // Determine if priority needs review (e.g., no priority specified for a task due today or tomorrow)
  const needsReview = (priority === 'medium' || priority === 'normal') && 
    (todayRegex.test(text) || tomorrowRegex.test(text)) && 
    !mediumPriorityRegex.test(text);
  
  return {
    title,
    description,
    due_date: dueDate,
    priority,
    location,
    subtasks,
    hasTimeConstraint,
    needsReview,
    dueTime
  };
}

/**
 * Converts parsed task info to task form data
 */
export function convertParsedTaskToFormData(parsedTask: ParsedTaskInfo): TaskFormData {
  // Convert dueDate to string format if it's a Date object
  const dueDateString = parsedTask.due_date instanceof Date 
    ? parsedTask.due_date.toISOString().split('T')[0]
    : parsedTask.due_date as string;
  
  // Create subtasks in the expected format
  const formattedSubtasks: SubTask[] = parsedTask.subtasks.map((text, index) => ({
    id: `temp-${index}`, // Temporary ID until saved
    task_id: 'pending', // Will be assigned when task is created
    content: text,
    is_completed: false
  }));
  
  return {
    title: parsedTask.title,
    description: parsedTask.description || '',
    due_date: dueDateString,
    due_time: parsedTask.dueTime,
    priority: parsedTask.priority || 'medium',
    location: parsedTask.location,
    subtasks: formattedSubtasks,
    status: 'pending',
    is_recurring: false
  };
}

/**
 * Get estimated time to complete a task based on subtasks and priority
 */
export function getEstimatedTaskTime(parsedTask: ParsedTaskInfo): string {
  const { subtasks, priority } = parsedTask;
  
  // Base time depends on number of subtasks
  let baseMinutes = 15; // Minimum 15 minutes
  
  if (subtasks.length > 0) {
    baseMinutes += subtasks.length * 10; // 10 minutes per subtask
  }
  
  // Adjust based on priority
  const priorityMultiplier = priority === 'high' || priority === 'urgent' 
    ? 0.8  // High priority tasks often take less time due to focus
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
}

/**
 * Generates a human-friendly confirmation text for a parsed task
 */
export function generateTaskConfirmationText(parsedTask: ParsedTaskInfo): string {
  const { title, due_date: dueDate, priority, location, subtasks } = parsedTask;
  
  let confirmationText = `I'll create a task: **${title}**\n\n`;
  
  // Add card-style preview
  confirmationText += "**Task Preview:**\n\n";
  
  // Add task details in formatted style
  confirmationText += `**Title:** ${title}\n`;
  
  if (priority) {
    confirmationText += `**Priority:** ${priority.charAt(0).toUpperCase() + priority.slice(1)}\n`;
  }
  
  if (dueDate) {
    const formattedDate = dueDate instanceof Date 
      ? dueDate.toLocaleString(undefined, { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        })
      : dueDate;
    confirmationText += `**Due Date:** ${formattedDate}\n`;
  }
  
  if (location) {
    confirmationText += `**Location:** ${location}\n`;
  }
  
  if (subtasks && subtasks.length > 0) {
    confirmationText += `**Subtasks:**\n`;
    subtasks.forEach((subtask, index) => {
      confirmationText += `- ${subtask}\n`;
    });
  }
  
  // Add estimated completion time based on subtasks
  confirmationText += `\n**Estimated time:** ${getEstimatedTaskTime(parsedTask)}\n\n`;
  
  // Add confirmation instructions
  confirmationText += "Would you like me to create this task? You can say something like 'Yes', 'Go ahead', or 'Create it'.";
  
  return confirmationText;
}
