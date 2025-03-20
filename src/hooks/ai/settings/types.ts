
import { AISettings } from "@/types/ai-assistant.types";
import { UseMutationResult } from "@tanstack/react-query";

export interface UseAISettingsResult {
  aiSettings: AISettings | null;
  isLoadingSettings: boolean;
  settingsError: Error | null;
  updateSettings: UseMutationResult<AISettings, Error, AISettings>;
  canUseAI: boolean;
}
