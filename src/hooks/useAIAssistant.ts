
import { useAIChat } from "./ai/useAIChat";
import { useAISettings } from "./ai/settings";
import { useAIKnowledge } from "./ai/useAIKnowledge";
import { AIMessage, AISettings, AIKnowledgeUpload } from "@/types/ai-assistant.types";

// Re-export types for backward compatibility
export type { AIMessage, AISettings, AIKnowledgeUpload };

// Interface for the sendMessage function that reflects the actual implementation
interface SendMessageFunction {
  (messageText: string): Promise<AIMessage>;
}

export const useAIAssistant = () => {
  const { messages, sendMessage, isLoading, clearMessages } = useAIChat();
  const { aiSettings, isLoadingSettings, updateSettings, canUseAI } = useAISettings();
  const { addKnowledge, knowledgeUploads, isLoadingKnowledge, deleteKnowledge } = useAIKnowledge();

  return {
    // Chat features
    messages,
    sendMessage,
    isLoading,
    clearMessages,
    
    // Settings features
    aiSettings,
    isLoadingSettings,
    updateSettings,
    canUseAI,
    
    // Knowledge features
    addKnowledge,
    knowledgeUploads,
    isLoadingKnowledge,
    deleteKnowledge,
  };
};
