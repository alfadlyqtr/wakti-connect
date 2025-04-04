
import { supabase } from "@/integrations/supabase/client";
import { AIMessage } from "@/types/ai-assistant.types";

// Function to call the AI assistant edge function with improved context fetching
export const callAIAssistant = async (token: string, message: string, userName: string = ""): Promise<{ response: string }> => {
  try {
    // Prepare context - this will be added to the message
    let context = "";
    
    // Get tasks data for context
    try {
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('id, title, status, priority, due_date')
        .order('due_date', { ascending: true })
        .limit(5);
        
      if (!taskError && taskData) {
        const todayTasks = taskData.filter(task => {
          const dueDate = new Date(task.due_date);
          const today = new Date();
          return dueDate.setHours(0,0,0,0) === today.setHours(0,0,0,0);
        });
        
        const tomorrowTasks = taskData.filter(task => {
          const dueDate = new Date(task.due_date);
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          return dueDate.setHours(0,0,0,0) === tomorrow.setHours(0,0,0,0);
        });
        
        context += `User has ${todayTasks.length} tasks due today and ${tomorrowTasks.length} tasks due tomorrow. `;
      }
    } catch (error) {
      console.warn("Error getting tasks data:", error);
    }
    
    // Get events/appointments
    try {
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('id, title, start_time, end_time')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5);
        
      if (!eventError && eventData && eventData.length > 0) {
        context += `User has ${eventData.length} upcoming events. `;
        
        // Add first event for more context
        if (eventData[0]) {
          const nextEvent = eventData[0];
          const eventDate = new Date(nextEvent.start_time);
          context += `Next event: "${nextEvent.title}" on ${eventDate.toLocaleDateString()} at ${eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}. `;
        }
      } else {
        context += "User has no upcoming events. ";
      }
    } catch (error) {
      console.warn("Error getting events data:", error);
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

// New function to check if the user has actual data
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
