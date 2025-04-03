
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAIMessages } from "../messages/useAIMessages";
import { 
  callAIAssistant, 
  checkIfOffTopic, 
  detectSystemCommand,
  getUserTasks,
  formatTasksForDisplay
} from "../utils/aiUtils";
import { toast } from "@/components/ui/use-toast";
import { useTaskContext } from "@/contexts/TaskContext";

export const useAIChatOperations = (userId?: string, userName: string = "") => {
  const {
    messages,
    addUserMessage,
    addAssistantMessage,
    addErrorMessage,
    addSystemMessage,
    clearMessages
  } = useAIMessages(userName);
  
  const [offTopicCount, setOffTopicCount] = useState(0);
  const [isProcessingCommand, setIsProcessingCommand] = useState(false);
  const taskContext = useTaskContext();

  // Handle system commands
  const handleSystemCommand = async (message: string) => {
    const commandInfo = detectSystemCommand(message);
    
    if (!commandInfo.isCommand) {
      return false;
    }
    
    setIsProcessingCommand(true);
    
    try {
      switch (commandInfo.type) {
        case 'create_task':
          if (commandInfo.params?.title) {
            // Create task using the TaskContext
            await taskContext.addTask({
              title: commandInfo.params.title,
              description: commandInfo.params.description || "",
              priority: (commandInfo.params.priority as any) || "normal",
              status: "pending",
              user_id: userId || "",
              created_at: new Date().toISOString(),
            });
            
            addSystemMessage(`✅ Task created: "${commandInfo.params.title}"`);
            return true;
          }
          return false;
          
        case 'view_tasks':
          // Fetch tasks using the task service
          const tasks = await getUserTasks();
          const formattedTasks = formatTasksForDisplay(tasks);
          addSystemMessage(formattedTasks);
          return true;
          
        case 'schedule_event':
          // For now, just acknowledge - we'll implement this fully in a future update
          if (commandInfo.params?.title) {
            addSystemMessage(`📅 I'll help you schedule an event: "${commandInfo.params.title}" (This feature is being implemented)`);
            return true;
          }
          return false;
          
        case 'check_calendar':
          // For now, just acknowledge - we'll implement this fully in a future update
          addSystemMessage("📅 Here's your calendar for today: (This feature is being implemented)");
          return true;
          
        default:
          return false;
      }
    } catch (error) {
      console.error("Error processing system command:", error);
      addErrorMessage(error);
      return false;
    } finally {
      setIsProcessingCommand(false);
    }
  };

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      if (!userId) throw new Error("User not authenticated");
      
      // Add user message to the list
      addUserMessage(message);
      
      // Check if this is a system command first
      const isHandled = await handleSystemCommand(message);
      if (isHandled) {
        return { response: "Command processed successfully" };
      }
      
      // Get authentication token
      const { data: authData } = await supabase.auth.getSession();
      const token = authData.session?.access_token;
      
      if (!token) throw new Error("Authentication token not found");
      
      console.log("Sending message to AI assistant", { message, token: token.substring(0, 10) + "..." });
      
      // Check if we need to enforce topic control
      const nonAssistantMessages = messages.filter(m => m.role === "user").length;
      
      // Check if message appears to be off-topic
      const isOffTopic = checkIfOffTopic(message);
      
      // Different response strategy based on off-topic count
      if (isOffTopic) {
        setOffTopicCount(prev => prev + 1);
        
        // After 5+ off-topic messages, suggest TMW AI
        if (offTopicCount >= 5) {
          const redirectMessage = `I notice we're getting a bit off-topic. As WAKTI AI, I'm specifically designed to help you with tasks, events, scheduling, business management, and other WAKTI platform features. For more general chat assistance, I recommend visiting TMW AI at https://tmw.qa/ai-chat-bot/.`;
          
          addAssistantMessage(redirectMessage);
          setOffTopicCount(0); // Reset counter after redirection
          return { response: redirectMessage };
        }
        // After 2-4 off-topic messages, give a gentle reminder but still answer
        else if (offTopicCount >= 2) {
          // Continue with the AI call but let the backend know to include a reminder
          message = message + " [CONTEXT: remind_about_wakti_focus]";
        }
      } else {
        // Reset counter when back on topic
        setOffTopicCount(0);
      }
      
      // Call the edge function
      const data = await callAIAssistant(token, message, userName);
      
      // Add AI response to the list
      addAssistantMessage(data.response);
      
      return data;
    },
    onError: (error) => {
      console.error("AI assistant error:", error);
      
      // Add error message to the list
      addErrorMessage(error);
      
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    messages,
    sendMessage,
    clearMessages,
    isProcessingCommand
  };
};
