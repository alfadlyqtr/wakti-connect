
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
  
  // Add a ref to track mode changes and debounce them
  const modeChangeTimeoutRef = useRef<number | null>(null);
  
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

  // Update the active mode when it changes - with debounce
  useEffect(() => {
    // Clear any existing timeout
    if (modeChangeTimeoutRef.current !== null) {
      window.clearTimeout(modeChangeTimeoutRef.current);
    }
    
    // Set a new timeout to debounce rapid mode changes
    modeChangeTimeoutRef.current = window.setTimeout(() => {
      console.log(`Mode change: ${activeMode} - updating messages`);
      setMessages(getMessages(activeMode));
    }, 50);
    
    // Cleanup function
    return () => {
      if (modeChangeTimeoutRef.current !== null) {
        window.clearTimeout(modeChangeTimeoutRef.current);
      }
    };
  }, [activeMode, getMessages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up any pending timeouts
      if (modeChangeTimeoutRef.current !== null) {
        window.clearTimeout(modeChangeTimeoutRef.current);
      }
    };
  }, []);

  // Wrap the sendMessage function to update our mode-specific message store
  const sendMessage = useCallback(async (message: string) => {
    // Prevent multiple concurrent sends and reuse of the same message
    if (processingMessageRef.current || messageSendingRef.current.inProgress) {
      console.warn("Message already being processed, aborting send");
      return { 
        success: false, 
        error: new Error("Message already being processed") 
      };
    }
    
    // Capture the message we're about to send
    messageSendingRef.current = { 
      text: message, 
      inProgress: true,
      retryCount: 0 
    };
    
    try {
      processingMessageRef.current = true;
      console.log(`Sending message in mode ${activeMode}: ${message.substring(0, 20)}...`);
      
      // First get the current messages for this mode
      const currentModeMessages = getMessages(activeMode);
      console.log(`Current messages in mode ${activeMode}: ${currentModeMessages.length}`);
      
      // Send the message using the enhanced chat hook
      const result = await originalSendMessage(message);
      
      // After sending, get the updated messages and update our mode-specific store
      if (result.success) {
        console.log("Message sent successfully, updating message stores");
        
        // Get the latest messages from the chat storage context
        const updatedMessages = getRecentContext();
        console.log(`Received updated context: ${updatedMessages.length} messages`);
        
        // We only want to add new messages that aren't already in our mode-specific store
        if (updatedMessages.length > currentModeMessages.length) {
          // First sync the entire context with our mode-specific store
          syncWithContext(activeMode, updatedMessages);
          
          // Update the local state with all messages for this mode
          const finalMessages = getMessages(activeMode);
          console.log(`Final messages after sync: ${finalMessages.length}`);
          setMessages(finalMessages);
        } else {
          console.warn(`Context didn't grow as expected: ${updatedMessages.length} <= ${currentModeMessages.length}`);
          // Force sync to prevent state inconsistency
          syncWithContext(activeMode, updatedMessages);
          setMessages(getMessages(activeMode));
        }
        
        // Reset the sending ref only on successful completion
        messageSendingRef.current = { text: '', inProgress: false, retryCount: 0 };
      } else {
        console.error("Message send failed:", result.error);
        
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
      
      return {
        ...result,
        keepInputText: result.success ? false : true,
      };
    } catch (error) {
      console.error("Error in sendMessage:", error);
      
      // Check for the specific channel closed error
      const isChannelClosedError = error.message && 
        error.message.includes("message channel closed before a response was received");
      
      if (isChannelClosedError) {
        console.warn("Message channel closed prematurely. Enabling retry.");
        toast({
          title: "Connection Issue",
          description: "Your message was interrupted. You can try again.",
          variant: "destructive",
          duration: 5000,
        });
      } else {
        // Show generic error toast
        toast({
          title: "Error sending message",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
          duration: 5000,
        });
      }
      
      // Don't clear sending state on failure, to allow for retry
      messageSendingRef.current.inProgress = false;
      messageSendingRef.current.retryCount += 1;
      
      return { 
        success: false, 
        error, 
        keepInputText: true,
        isChannelError: isChannelClosedError 
      };
    } finally {
      processingMessageRef.current = false;
    }
  }, [activeMode, originalSendMessage, getMessages, syncWithContext, getRecentContext]);

  // Function to retry the last failed message
  const retryLastMessage = useCallback(async () => {
    if (messageSendingRef.current.text && !messageSendingRef.current.inProgress) {
      const messageToRetry = messageSendingRef.current.text;
      console.log(`Retrying message: ${messageToRetry.substring(0, 20)}...`);
      
      toast({
        title: "Retrying message",
        description: "Attempting to resend your message",
        duration: 3000,
      });
      
      return sendMessage(messageToRetry);
    }
    return { success: false, error: new Error("No message to retry") };
  }, [sendMessage]);

  // Wrap the clearMessages function to clear only the current mode's messages
  const clearMessages = useCallback(() => {
    console.log(`Clearing messages for mode: ${activeMode}`);
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
    return messageSendingRef.current.inProgress ? messageSendingRef.current.text : 
           (messageSendingRef.current.retryCount > 0 ? messageSendingRef.current.text : null);
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
