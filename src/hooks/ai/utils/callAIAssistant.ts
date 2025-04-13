
import { supabase } from "@/lib/supabase";
import { AIMessage } from "@/types/ai-assistant.types";

// Function to call the AI assistant edge function with improved context fetching
export const callAIAssistant = async (token: string, message: string, userName: string = ""): Promise<{ response: string }> => {
  try {
    // Prepare context - this will be added to the message
    let context = "";
    
    // Get tasks data for context - Improved to handle empty data properly
    try {
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('id, title, status, priority, due_date')
        .order('due_date', { ascending: true })
        .limit(5);
        
      if (!taskError) {
        if (taskData && taskData.length > 0) {
          const today = new Date();
          today.setHours(0,0,0,0);
          
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0,0,0,0);
          
          const todayTasks = taskData.filter(task => {
            if (!task.due_date) return false;
            const dueDate = new Date(task.due_date);
            return dueDate.setHours(0,0,0,0) === today.getTime();
          });
          
          const tomorrowTasks = taskData.filter(task => {
            if (!task.due_date) return false;
            const dueDate = new Date(task.due_date);
            return dueDate.setHours(0,0,0,0) === tomorrow.getTime();
          });
          
          context += `User has ${todayTasks.length} tasks due today and ${tomorrowTasks.length} tasks due tomorrow. `;
          
          // Add specific task info if available
          if (todayTasks.length > 0) {
            context += `Today's tasks: ${todayTasks.map(t => t.title).join(', ')}. `;
          }
          
          if (tomorrowTasks.length > 0) {
            context += `Tomorrow's tasks: ${tomorrowTasks.map(t => t.title).join(', ')}. `;
          }
        } else {
          context += "User currently has no tasks in the system. ";
        }
      }
    } catch (error) {
      console.warn("Error getting tasks data:", error);
      context += "Unable to retrieve task information. ";
    }
    
    // Get events/appointments - Improved to handle empty data properly
    try {
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('id, title, start_time, end_time')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5);
        
      if (!eventError) {
        if (eventData && eventData.length > 0) {
          context += `User has ${eventData.length} upcoming events. `;
          
          // Add first event for more context
          if (eventData[0]) {
            const nextEvent = eventData[0];
            const eventDate = new Date(nextEvent.start_time);
            context += `Next event: "${nextEvent.title}" on ${eventDate.toLocaleDateString()} at ${eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}. `;
          }
          
          // List upcoming events
          if (eventData.length > 1) {
            context += `Other upcoming events: ${eventData.slice(1).map(e => e.title).join(', ')}. `;
          }
        } else {
          context += "User has no upcoming events in the system. ";
        }
      }
    } catch (error) {
      console.warn("Error getting events data:", error);
      context += "Unable to retrieve event information. ";
    }
    
    // Try to add current UI state as context
    try {
      // Get current path from window location
      const currentPath = window.location.pathname;
      let currentPage = "dashboard";
      
      // Map path to page name
      if (currentPath.includes("/tasks")) {
        currentPage = "tasks";
      } else if (currentPath.includes("/calendar") || currentPath.includes("/events")) {
        currentPage = "calendar";
      } else if (currentPath.includes("/staff")) {
        currentPage = "staff";
      } else if (currentPath.includes("/ai-assistant")) {
        currentPage = "ai-assistant";
      } else if (currentPath.includes("/analytics")) {
        currentPage = "analytics";
      } else if (currentPath.includes("/job-cards")) {
        currentPage = "job-cards";
      }
      
      // Store the current page info in context without saving to database
      context += `Current page: ${currentPage}. `;
      
    } catch (error) {
      console.warn("Error setting interface context:", error);
      // Continue without this context
    }
    
    // Add user context if we have a name
    if (userName) {
      context += `User name: ${userName}. `;
    }
    
    // Get AI assistant settings from localStorage for the selected role
    try {
      const aiSettingsString = localStorage.getItem('ai_settings');
      if (aiSettingsString) {
        const aiSettings = JSON.parse(aiSettingsString);
        if (aiSettings && aiSettings.role) {
          context += `Selected AI mode: ${aiSettings.role}. `;
        }
      }
    } catch (error) {
      console.warn("Error getting AI settings from localStorage:", error);
    }
    
    console.log("Sending AI request with context:", context);
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('ai-assistant', {
      body: {
        message,
        context
      }
    });
    
    if (error) {
      throw new Error(error.message || "Failed to call AI assistant");
    }
    
    return data;
  } catch (error) {
    console.error("Error calling AI assistant:", error);
    throw error;
  }
};

// Function to check if the user has actual data
export const hasUserData = async (userId: string): Promise<boolean> => {
  try {
    // Check for tasks
    const { count: taskCount, error: taskError } = await supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);
      
    // Check for events
    const { count: eventCount, error: eventError } = await supabase
      .from('events')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);
      
    if (taskError || eventError) {
      console.error("Error checking user data:", taskError || eventError);
      return false;
    }
    
    return (taskCount || 0) > 0 || (eventCount || 0) > 0;
  } catch (error) {
    console.error("Error checking user data:", error);
    return false;
  }
};
