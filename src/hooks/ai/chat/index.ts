
import { useState } from 'react';
import { AIMessage } from '@/types/ai-assistant.types';
import { useAuth } from '@/hooks/auth';
import { useProfile } from '@/hooks/useProfile';
import { useChatStorage } from './useChatStorage';
import { useTaskDetection } from './useTaskDetection';
import { useSendMessage } from './useSendMessage';
import { UseChatOptions } from './types';

export const useAIChatEnhanced = (options: UseChatOptions = {}) => {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    messages,
    setMessages,
    getRecentContext,
    clearMessages,
    contextWindowRef,
    sessionId,
  } = useChatStorage(options);
  
  const {
    detectedTask,
    setDetectedTask,
    pendingTaskConfirmation,
    setPendingTaskConfirmation,
    isCreatingTask,
    confirmCreateTask,
    cancelCreateTask,
  } = useTaskDetection(user?.id);

  const { sendMessage } = useSendMessage(
    options,
    setMessages,
    setIsLoading,
    setDetectedTask,
    setPendingTaskConfirmation,
    contextWindowRef,
    profile
  );

  return {
    // Chat features
    messages,
    sendMessage,
    isLoading,
    clearMessages,
    getRecentContext,
    
    // Task features
    detectedTask,
    confirmCreateTask,
    cancelCreateTask,
    isCreatingTask,
    pendingTaskConfirmation,
  };
};

export * from './types';
export * from './useChatStorage';
export * from './useTaskDetection';
export * from './useSendMessage';
