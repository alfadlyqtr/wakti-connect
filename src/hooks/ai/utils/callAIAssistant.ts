
import { supabase } from "@/integrations/supabase/client";

// Function to call the AI assistant edge function
export const callAIAssistant = async (token: string, message: string, userName: string = ""): Promise<{ response: string }> => {
  try {
    // Prepare context - this will be added to the message
    let context = "";
    
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
      
      // Try to check if the interface_state table exists before trying to use it
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        try {
          // Store the current page info in context without saving to database
          context += `Current page: ${currentPage}. `;
        } catch (error) {
          console.warn("Error setting interface context:", error);
        }
      }
    } catch (error) {
      console.warn("Error setting interface context:", error);
      // Continue without this context
    }
    
    // Add user context if we have a name
    if (userName) {
      context += `User name: ${userName}. `;
    }
    
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
