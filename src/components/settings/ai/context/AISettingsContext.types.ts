
import { AISettings, AIKnowledgeUpload } from "@/types/ai-assistant.types";

export type AISettingsContextType = {
  settings: AISettings | null;
  isLoadingSettings: boolean;
  isUpdatingSettings: boolean;
  isAddingKnowledge: boolean;
  knowledgeUploads?: AIKnowledgeUpload[];
  isLoadingKnowledge: boolean;
  canUseAI: boolean;
  error: string | null;
  updateSettings: (newSettings: AISettings) => Promise<void>;
  addKnowledge: (title: string, content: string) => Promise<void>;
  deleteKnowledge: (id: string) => Promise<void>;
  createDefaultSettings: () => Promise<void>;
  isCreatingSettings: boolean;
};
