
import { AISettings } from "@/types/ai-assistant.types";
import { UseMutationResult } from "@tanstack/react-query";

export const handleUpdateSettings = async (
  updateSettingsMutation: UseMutationResult<any, Error, AISettings, unknown>,
  newSettings: AISettings,
  setError: (error: string | null) => void
) => {
  try {
    await updateSettingsMutation.mutateAsync(newSettings);
    setError(null);
    return true;
  } catch (error) {
    console.error("Error updating settings:", error);
    setError(error instanceof Error ? error.message : "Unknown error occurred");
    return false;
  }
};
