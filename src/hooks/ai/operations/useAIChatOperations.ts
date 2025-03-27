
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAIMessages } from "../messages/useAIMessages";
import { callAIAssistant, checkIfOffTopic } from "../utils/aiUtils";
import { toast } from "@/components/ui/use-toast";

export const useAIChatOperations = (userId?: string, userName: string = "") => {
  const {
    messages,
    addUserMessage,
    addAssistantMessage,
    addErrorMessage,
    clearMessages
  } = useAIMessages(userName);
  
  const [offTopicCount, setOffTopicCount] = useState(0);

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      if (!userId) throw new Error("User not authenticated");
      
      // Add user message to the list
      addUserMessage(message);
      
      // Get authentication token
      const { data: authData } = await supabase.auth.getSession();
      const token = authData.session?.access_token;
      
      if (!token) throw new Error("Authentication token not found");
      
      console.log("Sending message to AI assistant", { message, token: token.substring(0, 10) + "..." });
      
      // Check if we need to enforce topic control (after 3 messages)
      const nonAssistantMessages = messages.filter(m => m.role === "user").length;
      
      if (nonAssistantMessages >= 2 && offTopicCount >= 2) {
        // Force redirection after multiple off-topic messages
        const redirectMessage = `I notice we're getting a bit off-topic. As WAKTI AI, I'm specifically designed to help you with tasks, events, scheduling, business management, and other WAKTI platform features. For more general chat assistance, I recommend TMW AI which you can find at https://tmw.qa/ai-chat-bot/. Now, how can I help you with your productivity and business management needs?`;
        
        addAssistantMessage(redirectMessage);
        setOffTopicCount(0); // Reset counter after redirection
        return { response: redirectMessage };
      }
      
      // Call the edge function
      const data = await callAIAssistant(token, message, userName);
      
      // Check if response appears to be off-topic
      const isOffTopic = checkIfOffTopic(message);
      if (isOffTopic) {
        setOffTopicCount(prev => prev + 1);
      } else {
        setOffTopicCount(0); // Reset if back on topic
      }
      
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
  };
};
