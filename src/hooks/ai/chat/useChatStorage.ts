
import { useState, useRef, useEffect } from 'react';
import { AIMessage } from '@/types/ai-assistant.types';
import { UseChatOptions } from './types';

// Constants for storage
const STORAGE_KEY = 'wakti-ai-chat';
const FIXED_SESSION_ID = 'global-chat-session';

export const useChatStorage = (options: UseChatOptions = {}) => {
  const [messages, setMessages] = useState<AIMessage[]>(options.initialMessages || []);
  
  // Use a fixed session ID instead of generating a new one
  const sessionIdRef = useRef(FIXED_SESSION_ID);
  
  // Preserve message history across component remounts
  useEffect(() => {
    // Check if there's a stored message history
    const storedMessages = localStorage.getItem(STORAGE_KEY);
    if (storedMessages && (!options.initialMessages || options.initialMessages.length === 0)) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
        }
      } catch (e) {
        console.error('Error parsing stored messages:', e);
      }
    }
  }, [options.initialMessages]);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const getRecentContext = () => {
    return messages;
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    messages,
    setMessages,
    getRecentContext,
    clearMessages,
    sessionId: sessionIdRef.current,
  };
};
