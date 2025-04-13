
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useAuth } from '@/hooks/auth';
import { AISettings, AIKnowledgeUpload, AIAssistantRole } from '@/types/ai-assistant.types';
import { useAISettingsQuery, useCanUseAIQuery } from '@/hooks/ai/settings/useAISettingsQueries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDefaultAISettings, updateAISettings } from '@/services/ai/aiSettingsService';
import { fetchKnowledgeUploads, addKnowledgeUpload, deleteKnowledgeUpload } from '@/services/ai/knowledgeService';
import { useToast } from '@/components/ui/use-toast';

interface AISettingsContextType {
  settings: AISettings | null;
  isLoadingSettings: boolean;
  isUpdatingSettings: boolean;
  error: Error | null;
  canUseAI: boolean;
  isCreatingSettings: boolean;
  createDefaultSettings: () => Promise<void>;
  updateSettings: (settings: AISettings) => Promise<boolean>;
  knowledgeUploads: AIKnowledgeUpload[];
  isLoadingKnowledge: boolean;
  isAddingKnowledge: boolean;
  addKnowledge: (title: string, content: string, role?: AIAssistantRole) => Promise<AIKnowledgeUpload>;
  deleteKnowledge: (id: string) => Promise<void>;
}

const AISettingsContext = createContext<AISettingsContextType | undefined>(undefined);

export function useAISettings() {
  const context = useContext(AISettingsContext);
  if (context === undefined) {
    throw new Error('useAISettings must be used within an AISettingsProvider');
  }
  return context;
}

interface AISettingsProviderProps {
  children: ReactNode;
}

export function AISettingsProvider({ children }: AISettingsProviderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [error, setError] = useState<Error | null>(null);
  
  // AI Settings query
  const { 
    data: settings, 
    isLoading: isLoadingSettings,
    error: settingsError
  } = useAISettingsQuery(user);

  // Check if user can use AI
  const { data: canUseAI = false } = useCanUseAIQuery(user);
  
  // Load knowledge uploads
  const [knowledgeUploads, setKnowledgeUploads] = useState<AIKnowledgeUpload[]>([]);
  const [isLoadingKnowledge, setIsLoadingKnowledge] = useState(false);
  
  // Load knowledge uploads
  React.useEffect(() => {
    if (user) {
      setIsLoadingKnowledge(true);
      fetchKnowledgeUploads()
        .then(uploads => {
          setKnowledgeUploads(uploads);
        })
        .catch(err => {
          console.error("Error loading knowledge uploads:", err);
          setError(err instanceof Error ? err : new Error(String(err)));
        })
        .finally(() => {
          setIsLoadingKnowledge(false);
        });
    }
  }, [user]);
  
  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: updateAISettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['ai-settings', user?.id], data);
      toast({
        title: "Settings Updated",
        description: "Your AI assistant settings have been updated.",
      });
    },
    onError: (err: any) => {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Error",
        description: "Failed to update settings. " + (err?.message || "Please try again."),
        variant: "destructive",
      });
    }
  });
  
  // Create default settings mutation
  const createDefaultSettingsMutation = useMutation({
    mutationFn: createDefaultAISettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['ai-settings', user?.id], data);
      toast({
        title: "Settings Created",
        description: "Default AI assistant settings have been created.",
      });
    },
    onError: (err: any) => {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Error",
        description: "Failed to create settings. " + (err?.message || "Please try again."),
        variant: "destructive",
      });
    }
  });
  
  // Add knowledge mutation
  const addKnowledgeMutation = useMutation({
    mutationFn: (params: { title: string; content: string; role?: AIAssistantRole }) => 
      addKnowledgeUpload(params.title, params.content, params.role),
    onSuccess: (data) => {
      setKnowledgeUploads(prev => [data, ...prev]);
      toast({
        title: "Knowledge Added",
        description: "Your knowledge item has been added to the AI assistant.",
      });
    },
    onError: (err: any) => {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Error",
        description: "Failed to add knowledge. " + (err?.message || "Please try again."),
        variant: "destructive",
      });
    }
  });
  
  // Delete knowledge mutation
  const deleteKnowledgeMutation = useMutation({
    mutationFn: deleteKnowledgeUpload,
    onSuccess: (_, id) => {
      setKnowledgeUploads(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Knowledge Deleted",
        description: "Your knowledge item has been removed.",
      });
    },
    onError: (err: any) => {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Error",
        description: "Failed to delete knowledge. " + (err?.message || "Please try again."),
        variant: "destructive",
      });
    }
  });
  
  // Effect to set error from query error
  React.useEffect(() => {
    if (settingsError) {
      setError(settingsError instanceof Error ? settingsError : new Error(String(settingsError)));
    }
  }, [settingsError]);
  
  // Create default settings function
  const createDefaultSettings = useCallback(async () => {
    if (!user) return;
    await createDefaultSettingsMutation.mutateAsync();
  }, [user, createDefaultSettingsMutation]);
  
  // Update settings function
  const updateSettings = useCallback(async (newSettings: AISettings): Promise<boolean> => {
    if (!user) return false;
    try {
      await updateSettingsMutation.mutateAsync(newSettings);
      return true;
    } catch (err) {
      return false;
    }
  }, [user, updateSettingsMutation]);
  
  // Add knowledge function
  const addKnowledgeHandler = useCallback(async (title: string, content: string, role?: AIAssistantRole) => {
    if (!user) throw new Error("Not authenticated");
    return await addKnowledgeMutation.mutateAsync({ title, content, role });
  }, [user, addKnowledgeMutation]);
  
  // Delete knowledge function
  const deleteKnowledgeHandler = useCallback(async (id: string) => {
    if (!user) throw new Error("Not authenticated");
    await deleteKnowledgeMutation.mutateAsync(id);
  }, [user, deleteKnowledgeMutation]);
  
  const value = {
    settings,
    isLoadingSettings,
    isUpdatingSettings: updateSettingsMutation.isPending,
    error,
    canUseAI: !!canUseAI,
    isCreatingSettings: createDefaultSettingsMutation.isPending,
    createDefaultSettings,
    updateSettings,
    knowledgeUploads,
    isLoadingKnowledge,
    isAddingKnowledge: addKnowledgeMutation.isPending,
    addKnowledge: addKnowledgeHandler,
    deleteKnowledge: deleteKnowledgeHandler
  };
  
  return (
    <AISettingsContext.Provider value={value}>
      {children}
    </AISettingsContext.Provider>
  );
}
