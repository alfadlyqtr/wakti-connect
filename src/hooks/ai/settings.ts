
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import { AISettings } from "@/types/ai-assistant.types";

const defaultSettings: AISettings = {
  user_id: "",
  assistant_name: "WAKTI",
  role: "general",
  tone: "balanced",
  response_length: "balanced",
  proactiveness: true,
  suggestion_frequency: "medium",
  enabled_features: {
    tasks: true,
    events: true,
    analytics: true,
    messaging: true,
    staff: true,
  },
};

export const useAISettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch settings
  const {
    data: aiSettings,
    isLoading: isLoadingSettings,
    error,
  } = useQuery({
    queryKey: ["aiSettings", user?.id],
    queryFn: async () => {
      if (!user) {
        return null;
      }

      try {
        const { data, error } = await supabase
          .from("ai_assistant_settings")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            // No settings found, create default
            return null;
          }
          throw new Error(error.message);
        }

        return data as AISettings;
      } catch (err) {
        console.error("Error fetching AI settings:", err);
        return null;
      }
    },
    enabled: !!user,
  });

  // Update settings
  const updateSettings = useMutation({
    mutationFn: async (newSettings: AISettings) => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Ensure user_id is set
      const settingsToUpdate = {
        ...newSettings,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from("ai_assistant_settings")
        .upsert(settingsToUpdate)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiSettings", user?.id] });
      toast({
        title: "Settings updated",
        description: "Your AI assistant settings have been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update settings",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Check if user can use AI
  const { data: canUseAI, isLoading: isCheckingAccess } = useQuery({
    queryKey: ["canUseAI", user?.id],
    queryFn: async () => {
      if (!user) {
        return false;
      }

      try {
        // Try using RPC first
        const { data: rpcData, error: rpcError } = await supabase.rpc(
          "can_use_ai_assistant"
        );

        if (!rpcError) {
          return !!rpcData;
        }

        // Fallback to direct check
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("account_type")
          .eq("id", user.id)
          .single();

        if (profileError) {
          return false;
        }

        return (
          profile?.account_type === "business" ||
          profile?.account_type === "individual"
        );
      } catch (err) {
        console.error("Error checking AI access:", err);
        return false;
      }
    },
    enabled: !!user,
  });

  return {
    aiSettings,
    isLoadingSettings: isLoadingSettings || isCheckingAccess,
    updateSettings,
    canUseAI,
    error,
  };
};
