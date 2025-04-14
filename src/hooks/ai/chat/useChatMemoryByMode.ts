import { AIMessage } from "@/types/ai-assistant.types";
import { useRef } from "react";

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

  const getMessages = (mode: string): AIMessage[] => {
    // Ensure the mode exists in our memory store
    if (!chatMemoryRef[mode]) {
      chatMemoryRef[mode] = [];
    }
    return chatMemoryRef[mode];
  };

  const setMessagesForMode = (mode: string, messages: AIMessage[]) => {
    // Update the mode's messages and set it as the active mode
    chatMemoryRef[mode] = messages;
    activeModeRef.current = mode;
  };

  const updateMessage = (mode: string, messageId: string, updateFn: (message: AIMessage) => AIMessage) => {
    const messages = getMessages(mode);
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex !== -1) {
      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = updateFn(messages[messageIndex]);
      setMessagesForMode(mode, updatedMessages);
    }
  };

  const addMessageToMode = (mode: string, message: AIMessage) => {
    const currentMessages = getMessages(mode);
    setMessagesForMode(mode, [...currentMessages, message]);
  };

  return { 
    getMessages, 
    setMessagesForMode, 
    updateMessage, 
    addMessageToMode,
    getCurrentMode: () => activeModeRef.current
  };
}
