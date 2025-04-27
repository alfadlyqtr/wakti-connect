
import { AISettings, AIKnowledgeUpload } from "@/components/ai/personality-switcher/types";

export interface AISettingsContextType {
  settings: AISettings | null;
  isLoadingSettings: boolean;
  isUpdatingSettings: boolean;
  isAddingKnowledge: boolean;
  knowledgeUploads: AIKnowledgeUpload[] | null;
  isLoadingKnowledge: boolean;
  canUseAI: boolean;
  error: string | Error | null;
  updateSettings: (newSettings: AISettings) => Promise<boolean>;
  addKnowledge: (title: string, content: string, role?: string) => Promise<boolean>;
  deleteKnowledge: (id: string) => Promise<boolean>;
  createDefaultSettings: () => Promise<void>;
  isCreatingSettings: boolean;
}
