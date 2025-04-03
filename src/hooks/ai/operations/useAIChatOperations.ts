
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AIMessage } from "@/types/ai-assistant.types";
import { callAIAssistant } from "../utils/callAIAssistant";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/hooks/useAuth";
import { useWAKTIFocusedConversation } from "../useWAKTIFocusedConversation";

const WAKTI_TOPICS = [
  "task management", "to-do lists", "appointments", "bookings", 
  "calendar", "scheduling", "contacts", "business management",
  "staff", "productivity", "organization", "time management"
];

/**
 * Hook containing chat operations for AI Assistant
 */
export const useAIChatOperations = () => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const { user } = useAuth();
  const { 
    prepareMessageWithContext, 
    increaseFocus, 
    decreaseFocus 
  } = useWAKTIFocusedConversation();
  
  // Mutation for sending a message to AI Assistant
  const sendMessage = useMutation({
    mutationFn: async (messageText: string) => {
      // Create unique IDs for messages
      const userMessageId = uuidv4();
      const aiMessageId = uuidv4();
      
      // Analyze if the message is about WAKTI topics
      const isWaktiRelated = WAKTI_TOPICS.some(topic => 
        messageText.toLowerCase().includes(topic)
      );
      
      // If message is related to WAKTI, increase focus
      if (isWaktiRelated) {
        const topic = WAKTI_TOPICS.find(topic => 
          messageText.toLowerCase().includes(topic)
        );
        await increaseFocus(topic);
      } else {
        // If not related, slightly decrease focus
        await decreaseFocus();
      }
      
      // Prepare message with WAKTI context
      const contextualMessage = prepareMessageWithContext(messageText);
      
      // Create and add user message to the messages array (show original message to user)
      const userMessage: AIMessage = {
        id: userMessageId,
        role: "user",
        content: messageText,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      try {
        // Get the token for authentication
        const token = "placeholder-token"; // This should come from auth context
        
        const userName = user?.user_metadata?.full_name || user?.user_metadata?.name;
        
        // Artificially add a small delay to see the loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Make the API call with contextual message
        const response = await callAIAssistant(token, contextualMessage, userName);
        
        // Create and add AI message to the messages array
        const aiMessage: AIMessage = {
          id: aiMessageId,
          role: "assistant",
          content: response.response,
          timestamp: new Date()
        };
        
        setMessages(prevMessages => [...prevMessages, aiMessage]);
        
        return aiMessage;
      } catch (error) {
        console.error("Error sending message to AI:", error);
        
        // Create and add error message
        const errorMessage: AIMessage = {
          id: aiMessageId,
          role: "error",
          content: error instanceof Error 
            ? `Sorry, I encountered an error: ${error.message}` 
            : "Sorry, I encountered an unexpected error. Please try again.",
          timestamp: new Date()
        };
        
        setMessages(prevMessages => [...prevMessages, errorMessage]);
        throw error;
      }
    }
  });
  
  // Clear all messages
  const clearMessages = () => {
    setMessages([]);
  };
  
  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading: sendMessage.isPending
  };
};
