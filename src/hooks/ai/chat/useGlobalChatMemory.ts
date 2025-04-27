
import { useState, useEffect, useCallback } from 'react';
import { ChatMemoryMessage } from '@/services/GlobalChatMemory';
import { globalChatMemory } from '@/services/GlobalChatMemory';
import { WAKTIAIMode } from '@/types/ai-assistant.types';

export const useGlobalChatMemory = (mode: WAKTIAIMode = 'general') => {
  const [messages, setMessages] = useState<ChatMemoryMessage[]>([]);
  
  // Subscribe to global chat memory
  useEffect(() => {
    // Initialize with current messages for selected mode
    setMessages(globalChatMemory.getMessages(mode));
    
    // Subscribe to updates
    const unsubscribe = globalChatMemory.subscribe((updatedMessages) => {
      setMessages(updatedMessages);
    });
    
    return unsubscribe;
  }, [mode]);
  
  // Function to add a message
  const addMessage = useCallback((message: Omit<ChatMemoryMessage, 'id'>) => {
    return globalChatMemory.addMessage({
      ...message,
      mode
    });
  }, [mode]);
  
  // Function to clear messages
  const clearMessages = useCallback(() => {
    globalChatMemory.clearMessages(mode);
  }, [mode]);
  
  // Function to get conversation transactions for analytics
  const getTransactions = useCallback(() => {
    // Each user/assistant pair is considered a transaction
    const transactions: { userMsg: ChatMemoryMessage, assistantMsg: ChatMemoryMessage }[] = [];
    
    for (let i = 0; i < messages.length - 1; i++) {
      if (messages[i].role === 'user' && messages[i+1].role === 'assistant') {
        transactions.push({
          userMsg: messages[i],
          assistantMsg: messages[i+1]
        });
      }
    }
    
    return transactions;
  }, [messages]);
  
  return {
    messages,
    addMessage,
    clearMessages,
    getTransactions
  };
};
