import { AISettings, AIKnowledgeUpload, AIAssistantRole } from "@/types/ai-assistant.types";
import { UseMutationResult } from "@tanstack/react-query";

export interface AISettingsContextType {
  settings: AISettings | null;
  isLoadingSettings: boolean;
  isUpdatingSettings: boolean;
  isAddingKnowledge: boolean;
  knowledgeUploads: AIKnowledgeUpload[] | null;
  isLoadingKnowledge: boolean;
  canUseAI: boolean;
  error: string | null;
  updateSettings: (newSettings: AISettings) => Promise<boolean>;
  addKnowledge: (title: string, content: string, role?: AIAssistantRole) => Promise<boolean>;
  deleteKnowledge: (id: string) => Promise<boolean>;
  createDefaultSettings: () => Promise<void>;
  isCreatingSettings: boolean;
}
