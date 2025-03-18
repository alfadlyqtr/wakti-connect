
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { AISettings } from "@/types/ai-assistant.types";

export const useAISettings = () => {
  const { user } = useAuth();

  // Fetch user's AI settings
  const { data: aiSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["aiSettings", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("ai_assistant_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "No rows returned" which is fine for first-time users
        throw error;
      }

      if (!data) {
        // Create default settings if none exist
        const defaultSettings = {
          user_id: user.id,
          assistant_name: "WAKTI",
          tone: "balanced",
          response_length: "balanced",
          proactiveness: true,
          suggestion_frequency: "medium",
          enabled_features: {
            tasks: true,
            events: true,
            staff: true,
            analytics: true,
            messaging: true,
          },
        };

        const { data: newSettings, error: insertError } = await supabase
          .from("ai_assistant_settings")
          .insert(defaultSettings)
          .select()
          .single();

        if (insertError) throw insertError;
        return newSettings as unknown as AISettings;
      }

      return data as unknown as AISettings;
    },
    enabled: !!user,
  });

  // Check if user can use AI assistant
  const { data: canUseAI } = useQuery({
    queryKey: ["canUseAI", user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data } = await supabase
        .from("profiles")
        .select("account_type")
        .eq("id", user.id)
        .single();

      return data?.account_type === "business" || data?.account_type === "individual";
    },
    enabled: !!user,
  });

  // Update AI settings
  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<AISettings>) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("ai_assistant_settings")
        .update(newSettings)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as AISettings;
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Your AI assistant settings have been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    aiSettings,
    isLoadingSettings,
    updateSettings,
    canUseAI,
  };
};
