
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AIMessage } from "@/types/ai-assistant.types";
import { callAIAssistant } from "../utils/callAIAssistant";
import { v4 as uuidv4 } from "uuid";

/**
 * Hook containing chat operations for AI Assistant
 */
export const useAIChatOperations = () => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  
  // Mutation for sending a message to AI Assistant
  const sendMessage = useMutation({
    mutationFn: async (messageText: string) => {
      // Check if this is an image message (format: ![alt](url))
      const isImageMessage = messageText.match(/!\[.*?\]\(.*?\)/);
      let imageUrl = null;
      let imageAlt = "";
      
      if (isImageMessage) {
        const match = messageText.match(/!\[(.*?)\]\((.*?)\)/);
        if (match) {
          imageAlt = match[1] || "Generated image";
          imageUrl = match[2];
        }
      }
      
      // Create unique IDs for messages
      const userMessageId = uuidv4();
      const aiMessageId = uuidv4();
      
      // Create and add user message to the messages array
      const userMessage: AIMessage = {
        id: userMessageId,
        role: "user",
        content: isImageMessage ? `Generated image: ${imageAlt}` : messageText,
        timestamp: new Date(),
        imageUrl: imageUrl,
        isImage: !!isImageMessage
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      try {
        // Get the token for authentication
        const token = "placeholder-token"; // This should come from auth context
        
        // Artificially add a small delay to see the loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For image messages, create a direct AI response without API call
        if (isImageMessage) {
          const aiMessage: AIMessage = {
            id: aiMessageId,
            role: "assistant",
            content: `I've added the image to our conversation. ${imageAlt ? `It shows: ${imageAlt}` : ''} Is there anything specific about this image you'd like to discuss?`,
            timestamp: new Date()
          };
          
          setMessages(prevMessages => [...prevMessages, aiMessage]);
          return aiMessage;
        }
        
        // For regular messages, make the API call
        const response = await callAIAssistant(token, messageText);
        
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
