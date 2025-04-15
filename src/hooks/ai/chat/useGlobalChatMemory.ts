
import { useEffect, useCallback } from 'react';
import { AIMessage } from '@/types/ai-assistant.types';

// Constants
const STORAGE_KEY = 'wakti-ai-chat';

// This hook provides minimal functionality to replace the mode-based memory system
export function useGlobalChatMemory() {
  const getMessages = useCallback((): AIMessage[] => {
    try {
      const storedMessages = localStorage.getItem(STORAGE_KEY);
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        if (Array.isArray(parsedMessages)) {
          return parsedMessages;
        }
      }
    } catch (error) {
      console.error("Error reading chat memory:", error);
    }
    return [];
  }, []);

  const setMessages = useCallback((messages: AIMessage[]) => {
    try {
      if (Array.isArray(messages)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        return true;
      }
    } catch (error) {
      console.error("Error saving chat memory:", error);
    }
    return false;
  }, []);

  const clearMessages = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("Error clearing chat memory:", error);
      return false;
    }
  }, []);

  return {
    getMessages,
    setMessages,
    clearMessages,
  };
}
