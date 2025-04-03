
import { useState } from "react";
import { useAIChatOperations } from "./operations/useAIChatOperations";
import { AIMessage } from "@/types/ai-assistant.types";

/**
 * Hook for AI chat functionality
 */
export const useAIChat = () => {
  const {
    messages,
    sendMessage,
    clearMessages,
    isLoading
  } = useAIChatOperations();
  
  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading
  };
};
