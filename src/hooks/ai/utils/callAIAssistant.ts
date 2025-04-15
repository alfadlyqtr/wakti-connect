
import { supabase } from "@/lib/supabase";
import { AIMessage } from "@/types/ai-assistant.types";
import { toast } from "@/hooks/use-toast";

// Function to call the AI assistant edge function with improved error handling
export const callAIAssistant = async (token: string, message: string, userName: string = ""): Promise<{ response: string; error?: any }> => {
  try {
    console.log("Calling AI assistant with message:", message.substring(0, 30) + "...");
    
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
    
    // Add user context if we have a name
    if (userName) {
      context += `User name: ${userName}. `;
    }
    
    console.log("Sending AI request with context:", context);
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("AI assistant request timed out after 30 seconds"));
      }, 30000); // 30 seconds timeout
    });
    
    // Create the edge function call promise
    const functionCallPromise = supabase.functions.invoke('ai-assistant', {
      body: {
        message,
        context
      }
    });
    
    // Use Promise.race to implement timeout
    const { data, error } = await Promise.race([
      functionCallPromise,
      timeoutPromise.then(() => ({ data: null, error: new Error("Request timed out") }))
    ]) as { data: any, error: any };
    
    // Handle errors from the function call
    if (error) {
      console.error("Error calling AI assistant:", error);
      
      return { 
        response: "", 
        error: {
          message: error.message || "Failed to reach AI assistant",
          isConnectionError: true
        }
      };
    }
    
    // Handle empty or invalid responses
    if (!data || !data.response) {
      console.error("Empty or invalid response from AI assistant");
            
      return { 
        response: "", 
        error: {
          message: "Received an empty response from the AI assistant",
          isEmptyResponse: true,
          isConnectionError: false
        }
      };
    }
    
    console.log("AI assistant response received successfully");
    return { response: data.response };
    
  } catch (error) {
    console.error("Unexpected error calling AI assistant:", error);
        
    return { 
      response: "", 
      error: {
        message: error.message || "Unexpected error communicating with AI",
        isUnexpectedError: true,
        isConnectionError: true
      }
    };
  }
};
