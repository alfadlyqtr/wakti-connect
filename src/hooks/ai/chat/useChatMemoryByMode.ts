
import { AIMessage } from "@/types/ai-assistant.types";

// Shared memory store across component instances
const chatMemoryRef: Record<string, AIMessage[]> = {
  general: [],
  student: [],
  creative: [],
  productivity: [],
};

export function useChatMemoryByMode() {
  const getMessages = (mode: string): AIMessage[] => {
    return chatMemoryRef[mode] || [];
  };

  const setMessagesForMode = (mode: string, messages: AIMessage[]) => {
    chatMemoryRef[mode] = messages;
  };

  return { getMessages, setMessagesForMode };
}
