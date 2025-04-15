
import { useAIChatEnhanced } from "./ai/chat";
import { useAISettings } from "./ai/settings";
import { useAIKnowledge } from "./ai/useAIKnowledge";
import { AIMessage, AISettings, AIKnowledgeUpload, WAKTIAIMode } from "@/types/ai-assistant.types";
import { useState, useEffect, useCallback, useRef } from "react";
import { useGlobalChatMemory } from "./ai/chat/useGlobalChatMemory";
import { toast } from "@/hooks/use-toast";

// Re-export types for backward compatibility
export type { AIMessage, AISettings, AIKnowledgeUpload };

export const useAIAssistant = () => {
  const [activeMode, setActiveMode] = useState<WAKTIAIMode>('general');
  const { getMessages, setMessages: saveMessages } = useGlobalChatMemory();
  const [messages, setMessages] = useState<AIMessage[]>(getMessages());
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

  // Sync with local storage on mount
  useEffect(() => {
    const storedMessages = getMessages();
    if (storedMessages.length > 0) {
      setMessages(storedMessages);
    }
  }, []);

  // Wrap the sendMessage function to update our global message store
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
      
      // Send the message using the enhanced chat hook
      const result = await originalSendMessage(message);
      
      // After sending, get the updated messages
      if (result.success) {
        console.log("Message sent successfully, updating message store");
        
        // Get the latest messages from the chat storage context
        const updatedMessages = getRecentContext();
        console.log(`Received updated context: ${updatedMessages.length} messages`);
        
        // Update local state and persist to storage
        setMessages(updatedMessages);
        saveMessages(updatedMessages);
        
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
  }, [activeMode, originalSendMessage, getRecentContext, saveMessages]);

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

  // Wrap the clearMessages function to clear global messages
  const clearMessages = useCallback(() => {
    console.log("Clearing all messages");
    originalClearMessages();
    setMessages([]);
    localStorage.removeItem('wakti-ai-chat');
  }, [originalClearMessages]);

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
