
import { useAIChatEnhanced } from "./ai/chat";
import { useAISettings } from "./ai/settings";
import { useAIKnowledge } from "./ai/useAIKnowledge";
import { AIMessage, AISettings, AIKnowledgeUpload, WAKTIAIMode } from "@/types/ai-assistant.types";
import { useState, useEffect } from "react";
import { useChatMemoryByMode } from "./ai/chat/useChatMemoryByMode";

// Re-export types for backward compatibility
export type { AIMessage, AISettings, AIKnowledgeUpload };

export const useAIAssistant = () => {
  const [activeMode, setActiveMode] = useState<WAKTIAIMode>('general');
  const { getMessages, setMessagesForMode } = useChatMemoryByMode();
  const [messages, setMessages] = useState<AIMessage[]>(getMessages(activeMode));
  
  const { 
    sendMessage: originalSendMessage, 
    isLoading, 
    clearMessages: originalClearMessages,
    detectedTask,
    confirmCreateTask,
    cancelCreateTask,
    isCreatingTask,
    pendingTaskConfirmation,
    getRecentContext
  } = useAIChatEnhanced();
  
  const { aiSettings, isLoadingSettings, updateSettings, canUseAI } = useAISettings();
  const { addKnowledge, knowledgeUploads, isLoadingKnowledge, deleteKnowledge } = useAIKnowledge();

  // Update the active mode when it changes
  useEffect(() => {
    setMessages(getMessages(activeMode));
  }, [activeMode, getMessages]);

  // Wrap the sendMessage function to update our mode-specific message store
  const sendMessage = async (message: string) => {
    const result = await originalSendMessage(message);
    // After sending, update the mode-specific message store
    const updatedMessages = getMessages(activeMode);
    setMessagesForMode(activeMode, updatedMessages);
    setMessages(updatedMessages);
    return result;
  };

  // Wrap the clearMessages function to clear only the current mode's messages
  const clearMessages = () => {
    originalClearMessages();
    setMessagesForMode(activeMode, []);
    setMessages([]);
  };

  return {
    // Chat features
    messages,
    sendMessage,
    isLoading,
    clearMessages,
    getRecentContext,
    activeMode,
    setActiveMode,
    
    // Task features
    detectedTask,
    confirmCreateTask,
    cancelCreateTask,
    isCreatingTask,
    pendingTaskConfirmation,
    
    // Settings features
    aiSettings,
    isLoadingSettings,
    updateSettings,
    canUseAI,
    
    // Knowledge features
    addKnowledge,
    knowledgeUploads,
    isLoadingKnowledge,
    deleteKnowledge,
  };
};
