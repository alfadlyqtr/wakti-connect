
import { useAIChatEnhanced } from "./ai/chat";
import { useAISettings } from "./ai/settings";
import { useAIKnowledge } from "./ai/useAIKnowledge";
import { AIMessage, AISettings, AIKnowledgeUpload, WAKTIAIMode } from "@/types/ai-assistant.types";
import { useState, useEffect, useCallback, useRef } from "react";
import { useGlobalChatMemory } from "./ai/chat/useGlobalChatMemory";
import { toast } from "@/hooks/use-toast";
import { useSendMessage } from "./ai/chat/useSendMessage";

// Re-export types for backward compatibility
export type { AIMessage, AISettings, AIKnowledgeUpload };

export const useAIAssistant = () => {
  const [activeMode, setActiveMode] = useState<WAKTIAIMode>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedTask, setDetectedTask] = useState<any | null>(null);
  const [pendingTaskConfirmation, setPendingTaskConfirmation] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  
  // Access the global memory for the current mode
  const { 
    messages, 
    clearMessages: clearGlobalMessages,
    getTransactions
  } = useGlobalChatMemory(activeMode);
  
  const processingMessageRef = useRef(false);
  
  // Get AI settings and knowledge hooks
  const { aiSettings, isLoadingSettings, updateSettings, canUseAI } = useAISettings();
  const { addKnowledge, knowledgeUploads, isLoadingKnowledge, deleteKnowledge } = useAIKnowledge();
  
  // Get send message functionality
  const { 
    sendMessage: sendMessageHandler, 
    retryLastMessage,
    isSending,
    sendingStatus,
    getLastAttemptedMessage
  } = useSendMessage(
    { enableTaskCreation: true },
    setIsLoading,
    setDetectedTask,
    setPendingTaskConfirmation,
    activeMode
  );
  
  // Synchronize mode changes to ensure memory is properly loaded
  useEffect(() => {
    console.log(`[useAIAssistant] Active mode changed to: ${activeMode}`);
  }, [activeMode]);
  
  // Wrapped send message function to ensure atomic operations
  const sendMessage = useCallback(async (message: string) => {
    if (processingMessageRef.current) {
      console.warn("[useAIAssistant] Message already being processed, aborting send");
      return { 
        success: false, 
        error: new Error("Message already being processed"),
        messageStatus: 'failed'
      };
    }
    
    processingMessageRef.current = true;
    setIsLoading(true);
    
    try {
      console.log(`[useAIAssistant] Sending message in ${activeMode} mode: ${message.substring(0, 20)}...`);
      const result = await sendMessageHandler(message);
      
      if (!result.success) {
        console.error("[useAIAssistant] Message send failed:", result.error);
        toast({
          title: "Send Failed",
          description: "Message could not be sent. You can try again.",
          variant: "destructive",
        });
      }
      
      return result;
    } catch (error) {
      console.error("[useAIAssistant] Error in sendMessage:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      
      return { 
        success: false, 
        error, 
        messageStatus: 'failed'
      };
    } finally {
      processingMessageRef.current = false;
      setIsLoading(false);
    }
  }, [activeMode, sendMessageHandler]);
  
  // Task handling functions
  const confirmCreateTask = useCallback(async (task: any) => {
    setIsCreatingTask(true);
    
    try {
      // Actual task creation logic would go here
      // For now we just simulate task creation with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDetectedTask(null);
      setPendingTaskConfirmation(false);
      
      toast({
        title: "Task Created",
        description: `"${task.title}" has been added to your tasks.`,
      });
    } catch (error) {
      console.error("[useAIAssistant] Error creating task:", error);
      toast({
        title: "Error Creating Task",
        description: error.message || "Failed to create task",
        variant: "destructive",
      });
    } finally {
      setIsCreatingTask(false);
    }
  }, []);
  
  const cancelCreateTask = useCallback(() => {
    setDetectedTask(null);
    setPendingTaskConfirmation(false);
  }, []);
  
  // Clear messages with confirmation
  const clearMessages = useCallback(() => {
    clearGlobalMessages();
    setDetectedTask(null);
    setPendingTaskConfirmation(false);
  }, [clearGlobalMessages]);
  
  // Get recent context (for AI context)
  const getRecentContext = useCallback(() => {
    // Return the last 10 messages as context
    return messages.slice(-10);
  }, [messages]);

  return {
    // Chat features
    messages,
    sendMessage,
    isLoading,
    clearMessages,
    getRecentContext,
    activeMode,
    setActiveMode,
    isMessageProcessing: () => processingMessageRef.current || isSending,
    getCurrentProcessingMessage: getLastAttemptedMessage,
    retryLastMessage,
    hasFailedMessage: () => !!getLastAttemptedMessage(),
    getTransactions,
    
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
