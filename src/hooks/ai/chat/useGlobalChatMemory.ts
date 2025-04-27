
import { useState, useEffect } from 'react';
import { AIMessage, WAKTIAIMode } from '@/types/ai-assistant.types';

// For demo purposes, we'll store messages in memory
// In a real app, this would likely use localStorage, IndexedDB, or a backend API
const chatMemory: Record<WAKTIAIMode, AIMessage[]> = {
  general: [],
  student: [],
  productivity: [],
  creative: [],
  employee: [],
  writer: [],
  business_owner: []
};

export const useGlobalChatMemory = (mode: WAKTIAIMode) => {
  const [messages, setMessages] = useState<AIMessage[]>(chatMemory[mode] || []);
  
  // Sync with the global memory when mode changes
  useEffect(() => {
    setMessages(chatMemory[mode] || []);
  }, [mode]);
  
  // Update the global memory when messages change
  useEffect(() => {
    chatMemory[mode] = messages;
  }, [messages, mode]);
  
  return { messages };
};
