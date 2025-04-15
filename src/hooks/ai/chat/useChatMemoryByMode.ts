
import { AIMessage } from "@/types/ai-assistant.types";
import { useRef, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

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
    // Validate input to prevent corruption
    if (!Array.isArray(messages)) {
      console.error("Invalid messages format, expected array:", messages);
      return false;
    }
    
    // Update the mode's messages and set it as the active mode
    chatMemoryRef[mode] = messages;
    activeModeRef.current = mode;
    return true;
  }, []);

  const updateMessage = useCallback((mode: string, messageId: string, updateFn: (message: AIMessage) => AIMessage) => {
    const messages = getMessages(mode);
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex !== -1) {
      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = updateFn(messages[messageIndex]);
      setMessagesForMode(mode, updatedMessages);
      return true;
    }
    return false;
  }, [getMessages, setMessagesForMode]);

  const addMessageToMode = useCallback((mode: string, message: AIMessage) => {
    try {
      if (!message || !message.id) {
        console.error("Invalid message format:", message);
        return false;
      }
      
      const currentMessages = getMessages(mode);
      
      // Check for duplicates to prevent adding the same message twice
      if (currentMessages.some(msg => msg.id === message.id)) {
        console.warn("Message already exists in memory:", message.id);
        return false;
      }
      
      const success = setMessagesForMode(mode, [...currentMessages, message]);
      return success;
    } catch (error) {
      console.error("Error adding message to mode:", error);
      return false;
    }
  }, [getMessages, setMessagesForMode]);

  // Improved sync with context window
  const syncWithContext = useCallback((mode: string, contextMessages: AIMessage[]) => {
    try {
      if (!Array.isArray(contextMessages)) {
        console.error("Invalid context messages format:", contextMessages);
        return false;
      }
      
      // Get current messages for comparison
      const currentMessages = getMessages(mode);
      
      // Check if we need to update (either context is longer or has different messages)
      if (contextMessages.length > currentMessages.length) {
        console.log(`Syncing mode ${mode} with context window (${contextMessages.length} messages)`);
        const success = setMessagesForMode(mode, [...contextMessages]);
        return success;
      }
      
      // Check for differences even if lengths are the same
      if (contextMessages.length === currentMessages.length) {
        const needsSync = contextMessages.some((msg, index) => 
          msg.id !== currentMessages[index]?.id || 
          msg.content !== currentMessages[index]?.content
        );
        
        if (needsSync) {
          console.log(`Syncing mode ${mode} due to content differences`);
          const success = setMessagesForMode(mode, [...contextMessages]);
          return success;
        }
      }
      
      return false; // No sync needed
    } catch (error) {
      console.error("Error syncing with context:", error);
      toast({
        title: "Sync Error", 
        description: "Failed to sync conversation state",
        variant: "destructive"
      });
      return false;
    }
  }, [getMessages, setMessagesForMode]);

  // Get the memory store for direct access (useful for global sync)
  const getMemoryStore = useCallback(() => {
    return chatMemoryRef;
  }, []);

  // Force full sync across all modes
  const syncAllModes = useCallback((sourceMessages: AIMessage[]) => {
    try {
      // Get current active mode
      const currentMode = activeModeRef.current;
      
      // Sync the current mode
      setMessagesForMode(currentMode, [...sourceMessages]);
      
      // Update memory and return success
      return true;
    } catch (error) {
      console.error("Error during full sync:", error);
      return false;
    }
  }, [setMessagesForMode]);

  return { 
    getMessages, 
    setMessagesForMode, 
    updateMessage, 
    addMessageToMode,
    syncWithContext,
    syncAllModes,
    getMemoryStore,
    getCurrentMode: () => activeModeRef.current
  };
}
