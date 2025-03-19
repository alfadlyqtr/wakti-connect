
import { toast } from "@/components/ui/use-toast";
import { AISettings } from "@/types/ai-assistant.types";

/**
 * Update AI assistant settings
 */
export const handleUpdateSettings = async (
  updateSettingsMutation: any,
  newSettings: AISettings,
  setError: (error: string | null) => void
) => {
  try {
    await updateSettingsMutation.mutateAsync(newSettings);
    toast({
      title: "Settings saved",
      description: "Your AI assistant settings have been updated",
    });
  } catch (err) {
    console.error("Error saving settings:", err);
    setError("Unable to save settings. Please try again.");
    toast({
      title: "Error saving settings",
      description: "There was a problem saving your AI assistant settings",
      variant: "destructive",
    });
    throw err;
  }
};
