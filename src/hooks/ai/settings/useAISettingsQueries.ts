
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
        // Since 'role' might not exist in all records, provide a default value
        role: (item as any).role as AIAssistantRole || 'general'
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
        // Get current session to ensure we have a fresh token
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          console.warn("No active session found when checking AI access");
          return false;
        }
        
        // First check account type directly from user metadata or profile
        // This provides a faster response and reduces RPC calls
        const userAccountType = user.user_metadata?.account_type || null;
        
        // Business and individual accounts directly from metadata can use AI
        if (userAccountType === 'business' || userAccountType === 'individual') {
          console.log("User can access AI based on metadata account type:", userAccountType);
          return true;
        }
        
        // If metadata doesn't confirm access, check profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("account_type")
          .eq("id", user.id)
          .single();
          
        if (!profileError && profile) {
          // Business and individual accounts from profile can use AI
          if (profile.account_type === 'business' || profile.account_type === 'individual') {
            console.log("User can access AI based on profile account type:", profile.account_type);
            return true;
          }
        }
        
        // As a last resort, use the RPC function
        try {
          const { data: canUse, error: rpcError } = await supabase.rpc("can_use_ai_assistant");
          
          if (rpcError) {
            console.error("RPC error when checking AI access:", rpcError);
            // We already checked profile and metadata, so if RPC fails, return false
            return false;
          }
          
          console.log("RPC access check result:", canUse);
          return canUse === true;
        } catch (rpcError) {
          console.error("Exception in RPC access check:", rpcError);
          return false;
        }
      } catch (error) {
        console.error("Error checking AI access:", error);
        return false;
      }
    },
    enabled: !!user,
    retry: 1,
    retryDelay: 2000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - Changed from cacheTime to gcTime
  });
};
