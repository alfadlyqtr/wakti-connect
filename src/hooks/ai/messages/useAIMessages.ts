
import { useState } from "react";
import { AIMessage } from "@/types/ai-assistant.types";

export const useAIMessages = (userFirstName: string = "") => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "welcome-message",
      role: "assistant",
      content: `Hello${userFirstName ? ` ${userFirstName}` : ''}! I'm your WAKTI AI assistant. How can I help you with your tasks, events, or business needs today?`,
      timestamp: new Date(),
    },
  ]);

  const addUserMessage = (message: string): AIMessage => {
    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    return userMessage;
  };

  const addAssistantMessage = (content: string): AIMessage => {
    const aiMessage: AIMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, aiMessage]);
    return aiMessage;
  };

  const addErrorMessage = (error: Error): AIMessage => {
    const errorMessage: AIMessage = {
      id: `error-${Date.now()}`,
      role: "assistant",
      content: `I apologize, but I encountered an error: ${error.message}. Please try again.`,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, errorMessage]);
    return errorMessage;
  };

  const clearMessages = () => setMessages([
    {
      id: "welcome-message",
      role: "assistant",
      content: `Hello${userFirstName ? ` ${userFirstName}` : ''}! I'm your WAKTI AI assistant. How can I help you with your tasks, events, or business needs today?`,
      timestamp: new Date(),
    },
  ]);

  return {
    messages,
    addUserMessage,
    addAssistantMessage,
    addErrorMessage,
    clearMessages
  };
};
