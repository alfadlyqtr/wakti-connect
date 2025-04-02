
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
  const [activeDocuments, setActiveDocuments] = useState<Array<any>>([]);

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
      
      // Prepare context object with any active documents
      const context = {
        documents: activeDocuments,
        conversationContext: ""
      };
      
      // Call the edge function
      const data = await callAIAssistant(token, message, userName, context);
      
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
  
  const addDocumentContext = (document: any) => {
    setActiveDocuments(prev => {
      // Check if document already exists
      const exists = prev.some(doc => doc.id === document.id);
      if (exists) return prev;
      
      // Add the new document
      return [...prev, document];
    });
  };
  
  const removeDocumentContext = (documentId: string) => {
    setActiveDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };
  
  const clearDocumentContext = () => {
    setActiveDocuments([]);
  };

  return {
    messages,
    sendMessage,
    clearMessages,
    addDocumentContext,
    removeDocumentContext,
    clearDocumentContext,
    activeDocuments
  };
};
