
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/hooks/auth";
import { AISettings } from "@/types/ai-assistant.types";

/**
 * Fetches the user's AI settings
 */
export const useAISettingsQuery = (user: User | null) => {
  return useQuery({
    queryKey: ["aiSettings", user?.id],
    queryFn: async () => {
      if (!user) {
        console.log("No user, can't fetch AI settings");
        return null;
      }

      console.log("Fetching AI settings for user:", user.id);

      // First check if the user can use AI assistant
      try {
        const { data: canUseAI, error: canUseAIError } = await supabase.rpc("can_use_ai_assistant");
        
        console.log("Can use AI check result:", { canUseAI, error: canUseAIError });
        
        if (canUseAIError) {
          console.log("RPC error, falling back to profile check");
          // Fallback to direct profile check
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("account_type")
            .eq("id", user.id)
            .single();

          if (profileError) {
            console.error("Error checking profile:", profileError);
            throw new Error(`Error checking profile: ${profileError.message}`);
          }

          console.log("Profile check for AI access, account type:", profile.account_type);

          if (profile.account_type !== "business" && profile.account_type !== "individual") {
            console.log("User account type not eligible:", profile.account_type);
            return null;
          }
        } else if (!canUseAI) {
          console.log("RPC check says user cannot use AI");
          return null;
        }
        
        console.log("User can use AI, fetching settings");

        // Try to fetch user's settings
        console.log("Attempting to fetch AI settings for user:", user.id);
        const { data, error } = await supabase
          .from("ai_assistant_settings")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          // Only log error if it's not "no rows returned" which is expected for first-time users
          if (error.code !== "PGRST116") {
            console.error("Error fetching AI settings:", error);
            throw new Error(`Error fetching AI settings: ${error.message}`);
          }
          
          console.log("No settings found for user:", user.id);
          return null;
        }

        if (!data) {
          console.log("No settings found, returning null");
          return null;
        }

        console.log("Settings fetched successfully:", data);
        
        // Create a proper AISettings object from the database result
        const settings: AISettings = {
          id: data.id,
          assistant_name: data.assistant_name || "WAKTI",
          tone: (data.tone as AISettings["tone"]) || "balanced",
          response_length: (data.response_length as AISettings["response_length"]) || "balanced",
          proactiveness: data.proactiveness !== null ? data.proactiveness : true,
          suggestion_frequency: (data.suggestion_frequency as AISettings["suggestion_frequency"]) || "medium",
          role: (data.role as AISettings["role"]) || "general",
          enabled_features: data.enabled_features as AISettings["enabled_features"] || {
            tasks: true,
            events: true,
            staff: true,
            analytics: true,
            messaging: true,
          }
        };
        
        return settings;
      } catch (error) {
        console.error("Error in AI settings fetch:", error);
        throw error;
      }
    },
    enabled: !!user,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Checks if the user can use the AI assistant
 */
export const useCanUseAIQuery = (user: User | null) => {
  return useQuery({
    queryKey: ["canUseAI", user?.id],
    queryFn: async () => {
      if (!user) return false;

      try {
        console.log("Checking if user can use AI:", user.id);
        // First try the RPC function
        const { data: canUse, error: rpcError } = await supabase.rpc("can_use_ai_assistant");
        
        if (!rpcError && canUse !== null) {
          console.log("RPC check result:", canUse);
          return canUse;
        }
        
        console.log("RPC check failed, falling back to profile check");
        // Fallback to checking the profile directly
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("account_type")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error checking access:", profileError);
          throw new Error(`Error checking access: ${profileError.message}`);
        }

        // Log the account type for debugging
        console.log("Account type for AI access check:", profile?.account_type);
        
        return profile?.account_type === "business" || profile?.account_type === "individual";
      } catch (error) {
        console.error("Error checking AI access:", error);
        throw error;
      }
    },
    enabled: !!user,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
