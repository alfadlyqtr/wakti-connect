
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AISettings, AIKnowledgeUpload, AIAssistantRole } from '@/types/ai-assistant.types';
import { User } from '@supabase/supabase-js';

// First implementation with proper types aligned with the database
export function useAISettingsQuery(user: User | null) {
  return useQuery({
    queryKey: ['ai-settings', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('ai_assistant_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      
      return {
        id: data.id,
        user_id: data.user_id,
        assistant_name: data.assistant_name,
        role: data.role as AIAssistantRole,
        tone: data.tone,
        response_length: data.response_length,
        proactiveness: data.proactiveness,
        suggestion_frequency: data.suggestion_frequency,
        enabled_features: data.enabled_features,
      } as AISettings;
    },
    enabled: !!user
  });
}

export function useAIKnowledgeUploadsQuery(user: User | null) {
  return useQuery({
    queryKey: ['ai-knowledge-uploads', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('ai_knowledge_uploads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        title: item.title,
        content: item.content,
        created_at: item.created_at,
        updated_at: item.updated_at || item.created_at,
        // Set default role if not present in the database
        role: (item.role as AIAssistantRole | undefined) || 'general'
      })) as AIKnowledgeUpload[];
    },
    enabled: !!user
  });
}

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
