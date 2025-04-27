
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { AISettings, AIKnowledgeUpload, WAKTIAIMode } from '@/components/ai/personality-switcher/types';
import { AISettingsContextType } from './AISettingsContext.types';
import { createDefaultSettings } from './createDefaultSettings';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Json } from '@/types/supabase';

// Create the context
const AISettingsContext = createContext<AISettingsContextType | undefined>(undefined);

interface AISettingsProviderProps {
  children: React.ReactNode;
}

export const AISettingsProvider: React.FC<AISettingsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | Error | null>(null);

  // Fetch AI settings
  const {
    data: settings,
    isLoading: isLoadingSettings,
    error: settingsError,
  } = useQuery({
    queryKey: ['ai-settings', userId],
    queryFn: async () => {
      if (!userId) return null;

      try {
        // Using ai_assistant_settings instead of ai_settings
        const { data, error } = await supabase
          .from('ai_assistant_settings')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        
        // Parse potentially nested JSON
        const parsedData: AISettings = {
          ...data,
          enabled_features: typeof data.enabled_features === 'string' 
            ? JSON.parse(data.enabled_features) 
            : data.enabled_features,
          // Ensure role is cast correctly to WAKTIAIMode
          role: data.role as WAKTIAIMode
        };
        
        return parsedData;
      } catch (error) {
        console.error('Error fetching AI settings:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch AI settings'));
        return null;
      }
    },
    enabled: !!userId,
  });

  // Fetch knowledge uploads
  const {
    data: knowledgeUploads,
    isLoading: isLoadingKnowledge,
  } = useQuery({
    queryKey: ['ai-knowledge', userId],
    queryFn: async () => {
      if (!userId) return null;

      try {
        const { data, error } = await supabase
          .from('ai_knowledge_uploads')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as AIKnowledgeUpload[];
      } catch (error) {
        console.error('Error fetching knowledge uploads:', error);
        return null;
      }
    },
    enabled: !!userId,
  });

  // Update settings mutation
  const updateSettings = useMutation({
    mutationFn: async (newSettings: AISettings) => {
      if (!userId) throw new Error('User not authenticated');

      // Convert WAKTIAIMode to string to match the database field type
      const dbSettings = {
        ...newSettings,
        role: newSettings.role as string, // Cast to string for database
      };

      // Using ai_assistant_settings instead of ai_settings
      const { data, error } = await supabase
        .from('ai_assistant_settings')
        .upsert({
          user_id: userId,
          assistant_name: dbSettings.assistant_name,
          role: dbSettings.role,
          tone: dbSettings.tone,
          response_length: dbSettings.response_length,
          proactiveness: dbSettings.proactiveness,
          suggestion_frequency: dbSettings.suggestion_frequency,
          enabled_features: dbSettings.enabled_features as Json,
        })
        .select()
        .single();

      if (error) throw error;
      return data as AISettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-settings', userId] });
      toast({
        title: 'Settings Updated',
        description: 'Your AI assistant settings have been updated.',
      });
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update AI settings. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Add knowledge mutation
  const addKnowledge = useMutation({
    mutationFn: async (data: { title: string; content: string; role?: string }) => {
      if (!userId) throw new Error('User not authenticated');

      const { title, content, role } = data;
      
      const { data: uploadData, error } = await supabase
        .from('ai_knowledge_uploads')
        .insert({
          title,
          content,
          user_id: userId,
          role
        })
        .select()
        .single();

      if (error) throw error;
      return uploadData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-knowledge', userId] });
      toast({
        title: 'Knowledge Added',
        description: 'Your knowledge has been successfully added.',
      });
    },
    onError: (error) => {
      console.error('Error adding knowledge:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to add knowledge. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Delete knowledge mutation
  const deleteKnowledge = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('ai_knowledge_uploads')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-knowledge', userId] });
      toast({
        title: 'Knowledge Deleted',
        description: 'Your knowledge has been successfully deleted.',
      });
    },
    onError: (error) => {
      console.error('Error deleting knowledge:', error);
      toast({
        title: 'Deletion Failed',
        description: 'Failed to delete knowledge. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Create default settings mutation
  const createSettingsMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      return await createDefaultSettings(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-settings', userId] });
      toast({
        title: 'Default Settings Created',
        description: 'Default AI assistant settings have been created.',
      });
    },
    onError: (error) => {
      console.error('Error creating default settings:', error);
      setError(error instanceof Error ? error : new Error('Failed to create default settings'));
      toast({
        title: 'Setup Failed',
        description: 'Failed to create default AI settings. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update error when settingsError changes
  useEffect(() => {
    if (settingsError) {
      setError(settingsError instanceof Error ? settingsError : new Error(String(settingsError)));
    }
  }, [settingsError]);

  // Determine if user can use AI
  const canUseAI = !!userId;

  // For debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('AI Settings Context State:', {
        settings,
        isLoadingSettings,
        error,
        canUseAI
      });
    }
  }, [settings, isLoadingSettings, error, canUseAI]);

  const contextValue: AISettingsContextType = {
    settings,
    isLoadingSettings,
    isUpdatingSettings: updateSettings.isPending,
    isAddingKnowledge: addKnowledge.isPending,
    knowledgeUploads,
    isLoadingKnowledge,
    canUseAI,
    error,
    updateSettings: updateSettings.mutate,
    addKnowledge: addKnowledge.mutate,
    deleteKnowledge: deleteKnowledge.mutate,
    createDefaultSettings: createSettingsMutation.mutate,
    isCreatingSettings: createSettingsMutation.isPending,
  };

  return (
    <AISettingsContext.Provider value={contextValue}>
      {children}
    </AISettingsContext.Provider>
  );
};

export const useAISettings = (): AISettingsContextType => {
  const context = useContext(AISettingsContext);
  if (!context) {
    throw new Error('useAISettings must be used within an AISettingsProvider');
  }
  return context;
};
