
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
        // Simplified approach: Trust the account type from metadata as the source of truth
        const accountType = user.user_metadata?.account_type;
        
        // Business and individual accounts can use AI
        if (accountType === 'business' || accountType === 'individual') {
          console.log("User can access AI based on account type from metadata:", accountType);
          return true;
        }
        
        // Only if metadata doesn't contain account_type, check profile as fallback
        if (!accountType) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("account_type")
            .eq("id", user.id)
            .maybeSingle();
            
          if (profile && (profile.account_type === 'business' || profile.account_type === 'individual')) {
            console.log("User can access AI based on profile account type:", profile.account_type);
            return true;
          }
        }
        
        // Default to denying access
        return false;
      } catch (error) {
        console.error("Error checking AI access:", error);
        return false;
      }
    },
    enabled: !!user,
    // Prevent excessive refetching - only check again after 5 minutes
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
