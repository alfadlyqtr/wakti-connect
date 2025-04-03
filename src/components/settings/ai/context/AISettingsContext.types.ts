
import { AISettings, AIKnowledgeUpload } from "@/types/ai-assistant.types";

export interface AISettingsContextType {
  settings: AISettings | null;
  isLoadingSettings: boolean;
  isUpdatingSettings: boolean;
  isAddingKnowledge: boolean;
  knowledgeUploads: AIKnowledgeUpload[] | null;
  isLoadingKnowledge: boolean;
  canUseAI: boolean | undefined;
  error: string | null;
  updateSettings: (newSettings: AISettings) => Promise<boolean>;
  addKnowledge: (title: string, content: string) => Promise<boolean>;
  deleteKnowledge: (id: string) => Promise<boolean>;
  createDefaultSettings: () => Promise<void>;
  isCreatingSettings: boolean;
}
