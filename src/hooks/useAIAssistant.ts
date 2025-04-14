
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
  const { getMessages, setMessagesForMode, addMessageToMode, syncWithContext } = useChatMemoryByMode();
  const [messages, setMessages] = useState<AIMessage[]>(getMessages(activeMode));
  const processingMessageRef = useRef(false);
  const messageSendingRef = useRef<{text: string, inProgress: boolean}>({text: '', inProgress: false});
  
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
    // Prevent multiple concurrent sends and reuse of the same message
    if (processingMessageRef.current || messageSendingRef.current.inProgress) {
      return { success: false, error: "Message already being processed" };
    }
    
    // Capture the message we're about to send
    messageSendingRef.current = { text: message, inProgress: true };
    
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
          // First sync the entire context with our mode-specific store
          syncWithContext(activeMode, updatedMessages);
          
          // Update the local state with all messages for this mode
          const finalMessages = getMessages(activeMode);
          setMessages(finalMessages);
        }
      }
      
      // Reset the sending ref only on successful completion
      if (result.success) {
        messageSendingRef.current = { text: '', inProgress: false };
      }
      
      return result;
    } catch (error) {
      console.error("Error in sendMessage:", error);
      return { success: false, error };
    } finally {
      processingMessageRef.current = false;
    }
  }, [activeMode, originalSendMessage, getMessages, syncWithContext, getRecentContext]);

  // Wrap the clearMessages function to clear only the current mode's messages
  const clearMessages = useCallback(() => {
    originalClearMessages();
    setMessagesForMode(activeMode, []);
    setMessages([]);
  }, [activeMode, originalClearMessages, setMessagesForMode]);

  // Helper method to check if a message is currently being processed
  const isMessageProcessing = useCallback(() => {
    return processingMessageRef.current || messageSendingRef.current.inProgress;
  }, []);

  // Helper to get the current message being processed (useful for recovery/retry)
  const getCurrentProcessingMessage = useCallback(() => {
    return messageSendingRef.current.inProgress ? messageSendingRef.current.text : null;
  }, []);

  return {
    // Chat features
    messages,
    sendMessage,
    isLoading,
    clearMessages,
    getRecentContext,
    activeMode,
    setActiveMode,
    isMessageProcessing,
    getCurrentProcessingMessage,
    
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
