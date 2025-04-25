import { useMemo } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { AISettings, AIKnowledgeUpload, AIAssistantRole } from '@/types/ai-assistant.types';

// Convert our custom User to SupabaseUser
const convertToSupabaseUser = (customUser: any): SupabaseUser | null => {
  if (!customUser) return null;
  
  return {
    id: customUser.id,
    email: customUser.email,
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated'
  } as SupabaseUser;
};

export function useAISettings() {
  const { user } = useAuth();
  const supabaseUser = convertToSupabaseUser(user);
  const queryClient = useQueryClient();
  
  const {
    data: settings,
    isLoading: isLoadingSettings,
    error: settingsError
  } = useQuery({
    queryKey: ['ai-settings', supabaseUser?.id],
    queryFn: async () => {
      if (!supabaseUser) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("ai_assistant_settings")
        .select("*")
        .eq("user_id", supabaseUser.id)
        .single();
        
      if (error) throw error;
      return data as AISettings;
    },
    enabled: !!supabaseUser
  });
  
  const { data: knowledgeUploads = [], isLoading: isLoadingKnowledge } = useQuery({
    queryKey: ['ai-knowledge-uploads', supabaseUser?.id],
    queryFn: async () => {
      if (!supabaseUser) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("ai_knowledge_uploads")
        .select("*")
        .eq("user_id", supabaseUser.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as AIKnowledgeUpload[];
    },
    enabled: !!supabaseUser
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: AISettings) => {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from("ai_assistant_settings")
        .update({
          assistant_name: newSettings.assistant_name,
          role: newSettings.role as AIAssistantRole,
          tone: newSettings.tone,
          response_length: newSettings.response_length,
          proactiveness: newSettings.proactiveness,
          suggestion_frequency: newSettings.suggestion_frequency,
          enabled_features: newSettings.enabled_features,
        })
        .eq("id", newSettings.id);
      
      if (error) throw error;
      return newSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-settings'] });
      toast({
        title: "Settings updated",
        description: "Your AI assistant settings have been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: `Failed to update settings: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });

  const addKnowledgeMutation = useMutation({
    mutationFn: async ({ title, content, role = 'general' }: {
      title: string;
      content: string;
      role?: AIAssistantRole;
    }) => {
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("ai_knowledge_uploads")
        .insert({
          user_id: user.id,
          title,
          content, 
          role
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as AIKnowledgeUpload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-knowledge-uploads'] });
      toast({
        title: "Knowledge added",
        description: "Your knowledge has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add knowledge",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });

  const deleteKnowledgeMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from("ai_knowledge_uploads")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-knowledge-uploads'] });
      toast({
        title: "Knowledge deleted",
        description: "The knowledge item has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });

  const updateSettings = useMemo(() => async (newSettings: AISettings) => {
    try {
      await updateSettingsMutation.mutateAsync(newSettings);
      return true;
    } catch (error) {
      return false;
    }
  }, [updateSettingsMutation]);

  const addKnowledge = useMemo(() => async (title: string, content: string, role?: AIAssistantRole) => {
    try {
      await addKnowledgeMutation.mutateAsync({ title, content, role });
      return true;
    } catch (error) {
      return false;
    }
  }, [addKnowledgeMutation]);

  const deleteKnowledge = useMemo(() => async (id: string) => {
    try {
      await deleteKnowledgeMutation.mutateAsync(id);
      return true;
    } catch (error) {
      return false;
    }
  }, [deleteKnowledgeMutation]);

  return {
    settings,
    isLoadingSettings,
    knowledgeUploads,
    isLoadingKnowledge,
    updateSettings,
    addKnowledge,
    deleteKnowledge,
  };
}
