
import { useAIChatEnhanced } from "./ai/chat";
import { useAISettings } from "./ai/settings";
import { useAIKnowledge } from "./ai/useAIKnowledge";
import { AIMessage, AISettings, AIKnowledgeUpload, WAKTIAIMode } from "@/types/ai-assistant.types";
import { useState, useEffect, useCallback, useRef } from "react";
import { useChatMemoryByMode } from "./ai/chat/useChatMemoryByMode";

// Re-export types for backward compatibility
export type { AIMessage, AISettings, AIKnowledgeUpload };

export const useAIAssistant = () => {
  const [activeMode, setActiveMode] = useState<WAKTIAIMode>('general');
  const { getMessages, setMessagesForMode, addMessageToMode } = useChatMemoryByMode();
  const [messages, setMessages] = useState<AIMessage[]>(getMessages(activeMode));
  const processingMessageRef = useRef(false);
  
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
  const sendMessage = useCallback(async (message: string) => {
    if (processingMessageRef.current) {
      return { success: false };
    }
    
    try {
      processingMessageRef.current = true;
      
      // First get the current messages for this mode
      const currentModeMessages = getMessages(activeMode);
      
      // Send the message using the enhanced chat hook
      const result = await originalSendMessage(message);
      
      // After sending, get the updated messages and update our mode-specific store
      if (result.success) {
        // Get the latest messages from the chat storage context
        const updatedMessages = getRecentContext();
        
        // We only want to add new messages that aren't already in our mode-specific store
        if (updatedMessages.length > currentModeMessages.length) {
          // Extract only the new messages
          const newMessages = updatedMessages.slice(currentModeMessages.length);
          
          // Add each new message to our mode-specific store
          newMessages.forEach(msg => {
            addMessageToMode(activeMode, msg);
          });
          
          // Update the local state with all messages for this mode
          const finalMessages = getMessages(activeMode);
          setMessages(finalMessages);
        }
      }
      
      return result;
    } finally {
      processingMessageRef.current = false;
    }
  }, [activeMode, originalSendMessage, getMessages, addMessageToMode, getRecentContext]);

  // Wrap the clearMessages function to clear only the current mode's messages
  const clearMessages = useCallback(() => {
    originalClearMessages();
    setMessagesForMode(activeMode, []);
    setMessages([]);
  }, [activeMode, originalClearMessages, setMessagesForMode]);

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
