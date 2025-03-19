
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { AISettings } from "@/types/ai-assistant.types";

export const useAISettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's AI settings
  const { data: aiSettings, isLoading: isLoadingSettings, error: settingsError } = useQuery({
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
        // Convert id to number if it's a string to match our AISettings type
        if (data.id && typeof data.id === 'string') {
          data.id = parseInt(data.id, 10);
        }
        
        return data as unknown as AISettings;
      } catch (error) {
        console.error("Error in AI settings fetch:", error);
        throw error;
      }
    },
    enabled: !!user,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Check if user can use AI assistant directly from the profile data
  const { data: canUseAI, isLoading: isLoadingAccess } = useQuery({
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

  // Update AI settings
  const updateSettings = useMutation({
    mutationFn: async (newSettings: AISettings) => {
      if (!user) throw new Error("User not authenticated");

      console.log("Updating AI settings:", newSettings);
      
      // Convert settings for Supabase (ensuring id is correctly handled)
      const settingsForUpdate = { ...newSettings };
      // Remove id if it's a number as Supabase expects string ID or none
      if (typeof settingsForUpdate.id === 'number') {
        delete settingsForUpdate.id;
      }

      const { data, error } = await supabase
        .from("ai_assistant_settings")
        .update(settingsForUpdate)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      
      console.log("Settings updated successfully");
      
      // Convert id to number for consistency in our app
      if (data && data.id && typeof data.id === 'string') {
        data.id = parseInt(data.id, 10);
      }
      
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
      console.error("Error updating AI settings:", error);
      toast({
        title: "Error updating settings",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  return {
    aiSettings,
    isLoadingSettings: isLoadingSettings || isLoadingAccess,
    settingsError,
    updateSettings,
    canUseAI: canUseAI === true,
  };
};
