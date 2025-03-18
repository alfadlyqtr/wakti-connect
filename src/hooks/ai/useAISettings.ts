
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { AISettings } from "@/types/ai-assistant.types";

export const useAISettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's AI settings
  const { data: aiSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["aiSettings", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      // First check if the user can use AI assistant
      const { data: canUseAI, error: canUseAIError } = await supabase.rpc("can_use_ai_assistant");
      
      if (canUseAIError) {
        console.error("Error checking AI access:", canUseAIError);
        // Fallback to direct profile check
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("account_type")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error checking profile:", profileError);
          return null;
        }

        if (profile.account_type !== "business" && profile.account_type !== "individual") {
          console.log("User account type not eligible:", profile.account_type);
          return null;
        }
      } else if (!canUseAI) {
        console.log("RPC check says user cannot use AI");
        return null;
      }

      const { data, error } = await supabase
        .from("ai_assistant_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "No rows returned" which is fine for first-time users
        console.error("Error fetching AI settings:", error);
        return null;
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

        if (insertError) {
          console.error("Error creating AI settings:", insertError);
          return null;
        }
        
        return newSettings as unknown as AISettings;
      }

      return data as unknown as AISettings;
    },
    enabled: !!user,
  });

  // Check if user can use AI assistant directly from the profile data
  const { data: canUseAI } = useQuery({
    queryKey: ["canUseAI", user?.id],
    queryFn: async () => {
      if (!user) return false;

      try {
        // First try the RPC function
        const { data: canUse, error: rpcError } = await supabase.rpc("can_use_ai_assistant");
        
        if (!rpcError && canUse !== null) {
          return canUse;
        }
        
        // Fallback to checking the profile directly
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("account_type")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error checking access:", profileError);
          return false;
        }

        // Log the account type for debugging
        console.log("Account type for AI access check:", profile?.account_type);
        
        return profile?.account_type === "business" || profile?.account_type === "individual";
      } catch (error) {
        console.error("Error checking AI access:", error);
        return false;
      }
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
      queryClient.invalidateQueries({ queryKey: ["aiSettings", user?.id] });
      toast({
        title: "Settings updated",
        description: "Your AI assistant settings have been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating settings",
        description: error instanceof Error ? error.message : "An error occurred",
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
