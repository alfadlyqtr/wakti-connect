
import { useState, useRef, useEffect, useCallback } from 'react';
import { AIMessage } from '@/types/ai-assistant.types';
import { v4 as uuidv4 } from 'uuid';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';
import { useGlobalChatMemory } from './useGlobalChatMemory';
import { toast } from '@/hooks/use-toast';

export const useAIChatEnhanced = () => {
  const { currentMode } = useAIPersonality();
  const [isLoading, setIsLoading] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  
  // Access the global chat memory for the current mode
  const { messages, addMessage, clearMessages } = useGlobalChatMemory(currentMode);
  
  // Track when the mode changes to prevent concurrent operations
  const processingRef = useRef(false);
  
  const sendMessage = useCallback(async (content: string) => {
    if (processingRef.current || !content.trim()) {
      return;
    }
    
    try {
      processingRef.current = true;
      setIsLoading(true);
      
      // Add user message to the chat
      const userMessage: AIMessage = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date(),
        mode: currentMode,
      };
      
      addMessage(userMessage);
      
      // Simulate AI response
      // In a real application, you would call your AI service here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiMessage: AIMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: `You're in ${currentMode} mode. This is a placeholder response to: "${content}"`,
        timestamp: new Date(),
        mode: currentMode,
      };
      
      addMessage(aiMessage);
      
      return { success: true };
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
      processingRef.current = false;
    }
  }, [currentMode, addMessage]);
  
  // Function to prompt for clear confirmation
  const promptClearMessages = useCallback(() => {
    setShowClearConfirmation(true);
  }, []);
  
  // Function to actually clear messages after confirmation
  const handleConfirmClear = useCallback(() => {
    clearMessages();
    setShowClearConfirmation(false);
    toast({
      title: "Chat Cleared",
      description: "All messages have been cleared.",
    });
  }, [clearMessages]);
  
  return {
    messages,
    sendMessage,
    isLoading,
    clearMessages: promptClearMessages,
    handleConfirmClear,
    showClearConfirmation,
    setShowClearConfirmation,
  };
};
