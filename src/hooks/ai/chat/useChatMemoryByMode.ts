import { AIMessage } from "@/types/ai-assistant.types";
import { useRef, useCallback, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

// Shared memory store across component instances
const chatMemoryRef: Record<string, AIMessage[]> = {
  general: [],
  student: [],
  creative: [],
  productivity: [],
};

// Track last sync time for each mode to prevent race conditions
const lastSyncTimeRef: Record<string, number> = {
  general: 0,
  student: 0,
  creative: 0,
  productivity: 0,
};

export function useChatMemoryByMode() {
  // Keep a reference to the currently active mode to track changes
  const activeModeRef = useRef<string>("general");
  // Add a stabilization timeout ref to prevent rapid changes
  const syncTimeoutRef = useRef<number | null>(null);
  // Track pending sync operations
  const pendingSyncsRef = useRef<Record<string, boolean>>({});

  // Initialize the hook
  useEffect(() => {
    return () => {
      // Clean up any pending timeouts on unmount
      if (syncTimeoutRef.current !== null) {
        window.clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  const getMessages = useCallback((mode: string): AIMessage[] => {
    // Ensure the mode exists in our memory store
    if (!chatMemoryRef[mode]) {
      console.log(`Initializing empty message store for mode: ${mode}`);
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
    
    // Safety check for message format
    const hasInvalidMessage = messages.some(msg => 
      !msg || typeof msg !== 'object' || !msg.id || !msg.role || !msg.content
    );
    
    if (hasInvalidMessage) {
      console.error("Invalid message format detected in array:", 
        messages.find(msg => !msg || typeof msg !== 'object' || !msg.id || !msg.role || !msg.content)
      );
      return false;
    }
    
    // Record when this update occurred
    lastSyncTimeRef[mode] = Date.now();
    
    // Update the mode's messages and set it as the active mode
    chatMemoryRef[mode] = messages;
    activeModeRef.current = mode;
    
    // Log the sync
    console.log(`Memory sync - Mode ${mode}: ${messages.length} messages stored`);
    
    return true;
  }, []);

  const updateMessage = useCallback((mode: string, messageId: string, updateFn: (message: AIMessage) => AIMessage) => {
    const messages = getMessages(mode);
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex !== -1) {
      try {
        const updatedMessage = updateFn(messages[messageIndex]);
        // Validate the updated message has the required fields
        if (!updatedMessage.id || !updatedMessage.role || !updatedMessage.content) {
          console.error("Invalid message update result:", updatedMessage);
          return false;
        }
        
        const updatedMessages = [...messages];
        updatedMessages[messageIndex] = updatedMessage;
        return setMessagesForMode(mode, updatedMessages);
      } catch (error) {
        console.error("Error updating message:", error);
        return false;
      }
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

  // Improved sync with context window - with debouncing and conflict resolution
  const syncWithContext = useCallback((mode: string, contextMessages: AIMessage[]) => {
    try {
      // Skip if there's a pending sync for this mode to prevent race conditions
      if (pendingSyncsRef.current[mode]) {
        console.log(`Skipping sync for mode ${mode} - another sync is in progress`);
        return false;
      }
      
      // Mark this mode as having a pending sync
      pendingSyncsRef.current[mode] = true;
      
      // Safety check for message format
      if (!Array.isArray(contextMessages)) {
        console.error("Invalid context messages format:", contextMessages);
        pendingSyncsRef.current[mode] = false;
        return false;
      }

      // Clear any existing timeout for this mode
      if (syncTimeoutRef.current !== null) {
        window.clearTimeout(syncTimeoutRef.current);
      }
      
      // Get current messages for comparison
      const currentMessages = getMessages(mode);
      
      // Log what we're about to do
      console.log(`Syncing mode ${mode} with context window (${contextMessages.length} messages)`);
      
      // Use a timeout to debounce rapid sync operations
      syncTimeoutRef.current = window.setTimeout(() => {
        // Check if we need to update (either context is longer or has different messages)
        if (contextMessages.length > currentMessages.length) {
          console.log(`Syncing mode ${mode}: context has ${contextMessages.length} messages, memory has ${currentMessages.length}`);
          setMessagesForMode(mode, [...contextMessages]);
        } else if (contextMessages.length === currentMessages.length) {
          // Check for differences even if lengths are the same
          const needsSync = contextMessages.some((msg, index) => 
            msg.id !== currentMessages[index]?.id || 
            msg.content !== currentMessages[index]?.content
          );
          
          if (needsSync) {
            console.log(`Syncing mode ${mode} due to content differences`);
            setMessagesForMode(mode, [...contextMessages]);
          } else {
            console.log(`No sync needed for mode ${mode} - content is identical`);
          }
        } else if (contextMessages.length < currentMessages.length) {
          // Context has fewer messages than memory - this may be a regression
          // In this case, we prioritize keeping more messages unless they're clearly different
          console.warn(`Context window for ${mode} has fewer messages (${contextMessages.length}) than memory (${currentMessages.length})`);
          
          // Check if the context messages are a subset of memory messages
          const isSubset = contextMessages.every((contextMsg, i) => 
            contextMsg.id === currentMessages[i]?.id && 
            contextMsg.content === currentMessages[i]?.content
          );
          
          if (!isSubset) {
            console.warn(`Context window messages differ from memory - forcing sync`);
            setMessagesForMode(mode, [...contextMessages]);
          } else {
            console.log(`Keeping existing messages in memory for mode ${mode}`);
          }
        }
        
        // Clear pending sync for this mode
        pendingSyncsRef.current[mode] = false;
      }, 100); // Short timeout to allow multiple rapid calls to be grouped
      
      return true;
    } catch (error) {
      console.error("Error syncing with context:", error);
      toast({
        title: "Sync Error", 
        description: "Failed to sync conversation state",
        variant: "destructive"
      });
      pendingSyncsRef.current[mode] = false;
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
      
      console.log(`Performing full sync across all modes from ${currentMode} (${sourceMessages.length} messages)`);
      
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
