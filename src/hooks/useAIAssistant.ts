
import { useAIChatEnhanced } from "./ai/chat";
import { useAISettings } from "./ai/settings";
import { useAIKnowledge } from "./ai/useAIKnowledge";
import { AIMessage, AISettings, AIKnowledgeUpload, WAKTIAIMode } from "@/types/ai-assistant.types";
import { useState, useEffect, useCallback, useRef } from "react";
import { useChatMemoryByMode } from "./ai/chat/useChatMemoryByMode";
import { toast } from "@/hooks/use-toast";

// Re-export types for backward compatibility
export type { AIMessage, AISettings, AIKnowledgeUpload };

export const useAIAssistant = () => {
  const [activeMode, setActiveMode] = useState<WAKTIAIMode>('general');
  const { getMessages, setMessagesForMode, addMessageToMode, syncWithContext } = useChatMemoryByMode();
  const [messages, setMessages] = useState<AIMessage[]>(getMessages(activeMode));
  const processingMessageRef = useRef(false);
  const messageSendingRef = useRef<{text: string, inProgress: boolean, retryCount: number}>({
    text: '', 
    inProgress: false,
    retryCount: 0
  });
  
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
    messageSendingRef.current = { 
      text: message, 
      inProgress: true,
      retryCount: 0 
    };
    
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
        
        // Reset the sending ref only on successful completion
        messageSendingRef.current = { text: '', inProgress: false, retryCount: 0 };
      } else {
        // Show error toast on failure
        toast({
          title: "Message failed to send",
          description: result.error?.message || "Please try again",
          variant: "destructive",
          duration: 5000,
        });
        
        // Don't clear sending state on failure, to allow for retry
        messageSendingRef.current.inProgress = false;
        messageSendingRef.current.retryCount += 1;
      }
      
      return result;
    } catch (error) {
      console.error("Error in sendMessage:", error);
      
      // Show error toast
      toast({
        title: "Error sending message",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
        duration: 5000,
      });
      
      // Don't clear sending state on failure, to allow for retry
      messageSendingRef.current.inProgress = false;
      messageSendingRef.current.retryCount += 1;
      
      return { success: false, error };
    } finally {
      processingMessageRef.current = false;
    }
  }, [activeMode, originalSendMessage, getMessages, syncWithContext, getRecentContext]);

  // Function to retry the last failed message
  const retryLastMessage = useCallback(async () => {
    if (messageSendingRef.current.text && !messageSendingRef.current.inProgress) {
      const messageToRetry = messageSendingRef.current.text;
      toast({
        title: "Retrying message",
        description: "Attempting to resend your message",
        duration: 3000,
      });
      return sendMessage(messageToRetry);
    }
    return { success: false, error: "No message to retry" };
  }, [sendMessage]);

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

  // Helper to check if there's a failed message that can be retried
  const hasFailedMessage = useCallback(() => {
    return !messageSendingRef.current.inProgress && 
           messageSendingRef.current.text.length > 0 && 
           messageSendingRef.current.retryCount > 0;
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
    retryLastMessage,
    hasFailedMessage,
    
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
