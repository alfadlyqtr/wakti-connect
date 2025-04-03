
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/task.types";
import { getUpcomingTasks, getTaskById } from "@/services/taskService";

export const checkIfOffTopic = (message: string): boolean => {
  const waktiKeywords = [
    'task', 'event', 'booking', 'schedule', 'appointment', 
    'business', 'staff', 'wakti', 'meeting', 'calendar', 
    'deadline', 'project', 'reminder', 'todo', 'productivity'
  ];
  
  const messageLower = message.toLowerCase();
  
  // Check if any WAKTI keywords are in the message
  return !waktiKeywords.some(keyword => messageLower.includes(keyword));
};

export const fetchUserProfile = async (userId: string): Promise<{ firstName: string }> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, display_name")
      .eq("id", userId)
      .single();
      
    if (error) {
      console.error("Error fetching user profile:", error);
      return { firstName: "" };
    }
    
    let name = "";
    if (data?.display_name) {
      name = data.display_name.split(" ")[0]; // Get first name
    } else if (data?.full_name) {
      name = data.full_name.split(" ")[0]; // Get first name
    }
    
    return { firstName: name };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { firstName: "" };
  }
};

export const callAIAssistant = async (
  token: string,
  message: string,
  userName?: string
): Promise<{ response: string }> => {
  const response = await fetch("https://sqdjqehcxpzsudhzjwbu.supabase.co/functions/v1/ai-assistant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      message,
      userName
    }),
  });
  
  if (!response.ok) {
    let errorMessage = "Error communicating with AI assistant";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      console.error("Failed to parse error response:", e);
    }
    throw new Error(errorMessage);
  }
  
  const data = await response.json();
  
  if (!data || !data.response) {
    throw new Error("Unexpected response format from AI assistant");
  }
  
  return data;
};

// New WAKTI system integration functions

// Detect WAKTI system commands in user input
export const detectSystemCommand = (message: string): { 
  isCommand: boolean; 
  type?: 'create_task' | 'view_tasks' | 'schedule_event' | 'check_calendar';
  params?: Record<string, string>;
} => {
  const messageLower = message.toLowerCase().trim();
  
  // Check for task creation commands
  if (messageLower.includes("create a task") || messageLower.includes("add task") || messageLower.includes("new task")) {
    return {
      isCommand: true,
      type: 'create_task',
      params: extractTaskParameters(message)
    };
  }
  
  // Check for task viewing commands
  if (messageLower.includes("show my tasks") || messageLower.includes("view tasks") || 
      messageLower.includes("list tasks") || messageLower.includes("what tasks do i have")) {
    return {
      isCommand: true,
      type: 'view_tasks'
    };
  }
  
  // Check for event scheduling commands
  if (messageLower.includes("schedule an event") || messageLower.includes("create event") || 
      messageLower.includes("new event") || messageLower.includes("add event")) {
    return {
      isCommand: true,
      type: 'schedule_event',
      params: extractEventParameters(message)
    };
  }
  
  // Check for calendar checking commands
  if (messageLower.includes("check my calendar") || messageLower.includes("what's on my calendar") || 
      messageLower.includes("view calendar") || messageLower.includes("show my schedule")) {
    return {
      isCommand: true,
      type: 'check_calendar'
    };
  }
  
  return { isCommand: false };
};

// Extract task parameters from natural language
const extractTaskParameters = (message: string): Record<string, string> => {
  const params: Record<string, string> = {};
  
  // Extract title (anything after "create a task" or similar phrases)
  const titleMatch = message.match(/(?:create a task|add task|new task)[:\s]+([^.!?]+)/i);
  if (titleMatch && titleMatch[1]) {
    params.title = titleMatch[1].trim();
  }
  
  // Extract due date
  const dueDateMatch = message.match(/(?:due|by|on)[:\s]+([^.!?]+)/i);
  if (dueDateMatch && dueDateMatch[1]) {
    params.dueDate = dueDateMatch[1].trim();
  }
  
  // Extract priority
  const priorityMatch = message.match(/(?:priority|importance)[:\s]+([^.!?]+)/i);
  if (priorityMatch && priorityMatch[1]) {
    const priority = priorityMatch[1].toLowerCase().trim();
    if (priority.includes("high") || priority.includes("urgent")) {
      params.priority = "high";
    } else if (priority.includes("medium")) {
      params.priority = "medium";
    } else if (priority.includes("low") || priority.includes("normal")) {
      params.priority = "normal";
    }
  }
  
  // Extract description
  const descriptionMatch = message.match(/(?:description|details|notes)[:\s]+([^.!?]+)/i);
  if (descriptionMatch && descriptionMatch[1]) {
    params.description = descriptionMatch[1].trim();
  }
  
  return params;
};

// Extract event parameters from natural language
const extractEventParameters = (message: string): Record<string, string> => {
  const params: Record<string, string> = {};
  
  // Extract title (anything after "schedule an event" or similar phrases)
  const titleMatch = message.match(/(?:schedule an event|create event|new event|add event)[:\s]+([^.!?]+)/i);
  if (titleMatch && titleMatch[1]) {
    params.title = titleMatch[1].trim();
  }
  
  // Extract date and time
  const dateTimeMatch = message.match(/(?:on|for|at)[:\s]+([^.!?]+)/i);
  if (dateTimeMatch && dateTimeMatch[1]) {
    params.dateTime = dateTimeMatch[1].trim();
  }
  
  // Extract duration
  const durationMatch = message.match(/(?:for|lasting|duration of)[:\s]+([^.!?]+)/i);
  if (durationMatch && durationMatch[1]) {
    params.duration = durationMatch[1].trim();
  }
  
  return params;
};

// Get user's upcoming tasks
export const getUserTasks = async (): Promise<Task[]> => {
  try {
    return await getUpcomingTasks();
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    return [];
  }
};

// Format tasks for AI display
export const formatTasksForDisplay = (tasks: Task[]): string => {
  if (tasks.length === 0) {
    return "You don't have any upcoming tasks.";
  }
  
  return "Here are your upcoming tasks:\n\n" + 
    tasks.map((task, index) => {
      const dueDate = task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date";
      return `${index + 1}. ${task.title} (${task.priority} priority) - Due: ${dueDate}`;
    }).join("\n");
};
