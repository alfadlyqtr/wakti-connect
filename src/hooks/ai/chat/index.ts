import { useChatStorage } from './useChatStorage';
import { useState, useRef, useCallback } from 'react';
import { useSendMessage } from './useSendMessage';
import { AIMessage } from '@/types/ai-assistant.types';
import { AITaskDetectionResult } from './types';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useAIChatEnhanced = (options = {}) => {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedTask, setDetectedTask] = useState<AITaskDetectionResult | null>(null);
  const [pendingTaskConfirmation, setPendingTaskConfirmation] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  
  // Use the new global storage hook
  const { 
    messages, 
    setMessages, 
    clearMessages: clearStoredMessages,
    getRecentContext 
  } = useChatStorage(options);
  
  // Send message using the updated hook that works with global memory
  const { 
    sendMessage, 
    retryLastMessage,
    isSending
  } = useSendMessage(
    options,
    setIsLoading,
    setDetectedTask,
    setPendingTaskConfirmation,
    'general' // Default active mode
  );

  // Task confirmation functions
  const confirmCreateTask = useCallback(async () => {
    if (!detectedTask) return;
    
    setIsCreatingTask(true);
    try {
      // Task creation logic would go here
      console.log("Creating task:", detectedTask);
      
      // For now, just clear the task after a small delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPendingTaskConfirmation(false);
      setDetectedTask(null);
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsCreatingTask(false);
    }
  }, [detectedTask]);

  const cancelCreateTask = useCallback(() => {
    setPendingTaskConfirmation(false);
    setDetectedTask(null);
  }, []);

  return {
    messages,
    sendMessage,
    isLoading: isLoading || isSending,
    clearMessages: clearStoredMessages,
    detectedTask,
    pendingTaskConfirmation,
    confirmCreateTask,
    cancelCreateTask,
    isCreatingTask,
    retryLastMessage,
    getRecentContext,
  };
};
