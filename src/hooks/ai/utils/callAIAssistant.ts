
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
      
      // Save current page to user_interface_state if we have a valid session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        // Check if the table exists before trying to insert
        try {
          const { count, error: tableCheckError } = await supabase
            .from('user_interface_state')
            .select('*', { count: 'exact', head: true })
            .limit(1);
          
          if (tableCheckError) {
            console.log("user_interface_state table doesn't exist yet");
          } else {
            // Table exists, update or insert state
            const { error: upsertError } = await supabase
              .from('user_interface_state')
              .upsert({
                user_id: session.user.id,
                current_page: currentPage,
                last_interaction: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'user_id',
                ignoreDuplicates: false
              });
              
            if (upsertError) {
              console.error("Error updating interface state:", upsertError);
            }
          }
        } catch (error) {
          console.warn("Error checking for user_interface_state table:", error);
        }
      }
      
      context += `Current page: ${currentPage}. `;
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
