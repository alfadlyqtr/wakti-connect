
import { useState, useCallback } from 'react';
import { AIMessage, WAKTIAIMode } from '@/types/ai-assistant.types';
import { v4 as uuidv4 } from 'uuid';

export const useGlobalChat = () => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // In a real app, this would be based on user permissions or subscription
  const canUseAI = true;
  
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;
    
    // Create a user message
    const userMessage: AIMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to an AI service
      // For now, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create an assistant response
      const assistantMessage: AIMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: `I received your message: "${content}". This is a simulated response for demonstration purposes.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);
  
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    canUseAI
  };
};
