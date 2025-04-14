
import { AIMessage } from "@/types/ai-assistant.types";
import { useRef, useCallback } from "react";

// Shared memory store across component instances
const chatMemoryRef: Record<string, AIMessage[]> = {
  general: [],
  student: [],
  creative: [],
  productivity: [],
};

export function useChatMemoryByMode() {
  // Keep a reference to the currently active mode to track changes
  const activeModeRef = useRef<string>("general");

  const getMessages = useCallback((mode: string): AIMessage[] => {
    // Ensure the mode exists in our memory store
    if (!chatMemoryRef[mode]) {
      chatMemoryRef[mode] = [];
    }
    return chatMemoryRef[mode];
  }, []);

  const setMessagesForMode = useCallback((mode: string, messages: AIMessage[]) => {
    // Update the mode's messages and set it as the active mode
    chatMemoryRef[mode] = messages;
    activeModeRef.current = mode;
  }, []);

  const updateMessage = useCallback((mode: string, messageId: string, updateFn: (message: AIMessage) => AIMessage) => {
    const messages = getMessages(mode);
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex !== -1) {
      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = updateFn(messages[messageIndex]);
      setMessagesForMode(mode, updatedMessages);
    }
  }, [getMessages, setMessagesForMode]);

  const addMessageToMode = useCallback((mode: string, message: AIMessage) => {
    const currentMessages = getMessages(mode);
    setMessagesForMode(mode, [...currentMessages, message]);
    return true; // Indicate success
  }, [getMessages, setMessagesForMode]);

  // New method to sync with the context window
  const syncWithContext = useCallback((mode: string, contextMessages: AIMessage[]) => {
    // Only sync if we have more messages in the context than in memory
    const currentMessages = getMessages(mode);
    if (contextMessages.length > currentMessages.length) {
      setMessagesForMode(mode, [...contextMessages]);
      return true;
    }
    return false;
  }, [getMessages, setMessagesForMode]);

  // Get the memory store for direct access (useful for global sync)
  const getMemoryStore = useCallback(() => {
    return chatMemoryRef;
  }, []);

  return { 
    getMessages, 
    setMessagesForMode, 
    updateMessage, 
    addMessageToMode,
    syncWithContext,
    getMemoryStore,
    getCurrentMode: () => activeModeRef.current
  };
}
