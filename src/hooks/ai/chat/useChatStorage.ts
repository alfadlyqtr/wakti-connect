import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AIMessage } from '@/types/ai-assistant.types';
import { UseChatOptions } from './types';

export const useChatStorage = (options: UseChatOptions = {}) => {
  const [messages, setMessages] = useState<AIMessage[]>(options.initialMessages || []);
  
  // Generate a unique session ID if not provided
  const sessionIdRef = useRef(options.sessionId || `session-${uuidv4()}`);
  
  // Keep recent context in memory for faster back-references
  const contextWindowRef = useRef<AIMessage[]>([]);
  
  // Preserve message history across component remounts
  useEffect(() => {
    // Check if there's a stored message history for this session
    const storedMessages = localStorage.getItem(`ai-chat-${sessionIdRef.current}`);
    if (storedMessages && (!options.initialMessages || options.initialMessages.length === 0)) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
          contextWindowRef.current = parsedMessages;
        }
      } catch (e) {
        console.error('Error parsing stored messages:', e);
      }
    }
  }, [options.initialMessages]);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`ai-chat-${sessionIdRef.current}`, JSON.stringify(messages));
      contextWindowRef.current = messages;
    }
  }, [messages]);

  const getRecentContext = () => {
    return contextWindowRef.current;
  };

  const clearMessages = () => {
    setMessages([]);
    contextWindowRef.current = [];
    localStorage.removeItem(`ai-chat-${sessionIdRef.current}`);
  };

  return {
    messages,
    setMessages,
    getRecentContext,
    clearMessages,
    sessionId: sessionIdRef.current,
    contextWindowRef,
  };
};
