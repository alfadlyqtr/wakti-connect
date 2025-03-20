
import { AISettings } from "@/types/ai-assistant.types";

export interface UseAISettingsResult {
  aiSettings: AISettings | null;
  isLoadingSettings: boolean;
  settingsError: Error | null;
  updateSettings: ReturnType<typeof import('@tanstack/react-query')['useMutation']<AISettings, Error, AISettings>>;
  canUseAI: boolean;
}
