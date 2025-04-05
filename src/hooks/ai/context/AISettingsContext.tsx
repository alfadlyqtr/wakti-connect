import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { AISettings, AIAssistantRole, AIKnowledgeUpload } from '@/types/ai-assistant.types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Default settings
const defaultSettings: AISettings = {
  user_id: '',
  assistant_name: 'WAKTI',
  role: 'general',
  tone: 'balanced',
  response_length: 'balanced',
  proactiveness: true,
  suggestion_frequency: 'medium',
  enabled_features: {
    tasks: true,
    events: true,
    analytics: true,
    messaging: true,
    staff: true
  }
};

// Define the context type
interface AISettingsContextType {
  settings: AISettings | null;
  isLoadingSettings: boolean;
  error: any;
  updateSettings: (settings: AISettings) => Promise<boolean>;
  canUseAI: boolean;
  createDefaultSettings: () => Promise<AISettings>;
  isCreatingSettings: boolean;
  knowledgeUploads: AIKnowledgeUpload[] | undefined;
  isLoadingKnowledge: boolean;
  addKnowledge: (data: { title: string; content: string; role?: AIAssistantRole }) => Promise<any>;
  deleteKnowledge: (id: string) => Promise<any>;
  isAddingKnowledge: boolean;
}

const AISettingsContext = createContext<AISettingsContextType | undefined>(undefined);

export const AISettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [canUseAI, setCanUseAI] = useState(false);
  
  // Fetch AI settings
  const { 
    data: settings, 
    isLoading: isLoadingSettings, 
    error 
  } = useQuery({
    queryKey: ['aiSettings', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('ai_assistant_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        throw error;
      }
      
      return data as AISettings;
    },
    enabled: !!user
  });
  
  // Fetch knowledge uploads
  const { 
    data: knowledgeUploads, 
    isLoading: isLoadingKnowledge 
  } = useQuery({
    queryKey: ['aiKnowledge', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('ai_knowledge_uploads')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      return data as AIKnowledgeUpload[];
    },
    enabled: !!user
  });
  
  // Create default settings mutation
  const createSettingsMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const newSettings = { 
        ...defaultSettings,
        user_id: user.id,
      };
      
      const { data, error } = await supabase
        .from('ai_assistant_settings')
        .insert(newSettings)
        .select()
        .single();
        
      if (error) throw error;
      return data as AISettings;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['aiSettings', user?.id], data);
    }
  });
  
  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (updatedSettings: AISettings) => {
      if (!user) throw new Error("User not authenticated");
      
      // Ensure user_id is set
      updatedSettings.user_id = user.id;
      
      const { data, error } = await supabase
        .from('ai_assistant_settings')
        .upsert(updatedSettings)
        .select()
        .single();
        
      if (error) throw error;
      return data as AISettings;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['aiSettings', user?.id], data);
      toast({
        title: "Settings updated",
        description: "Your AI assistant settings have been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update settings",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Add knowledge mutation
  const addKnowledgeMutation = useMutation({
    mutationFn: async ({ title, content, role }: { title: string; content: string; role?: AIAssistantRole }) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('ai_knowledge_uploads')
        .insert({
          user_id: user.id,
          title,
          content,
          role
        })
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiKnowledge', user?.id] });
      toast({
        title: "Knowledge added",
        description: "Your knowledge has been added to the AI assistant.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add knowledge",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Delete knowledge mutation
  const deleteKnowledgeMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('ai_knowledge_uploads')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiKnowledge', user?.id] });
      toast({
        title: "Knowledge deleted",
        description: "The knowledge item has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete knowledge",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  useEffect(() => {
    const checkAIAccess = async () => {
      if (!user) {
        setCanUseAI(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .rpc('can_use_ai_assistant');
          
        if (!error) {
          setCanUseAI(!!data);
        } else {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('account_type')
            .eq('id', user.id)
            .single();
            
          if (!profileError) {
            setCanUseAI(
              profile?.account_type === 'individual' || 
              profile?.account_type === 'business'
            );
          }
        }
      } catch (error) {
        console.error("Error checking AI access:", error);
        setCanUseAI(false);
      }
    };
    
    checkAIAccess();
  }, [user]);
  
  // Create default settings if none exist
  const createDefaultSettings = async (): Promise<AISettings> => {
    try {
      return await createSettingsMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to create default settings:", error);
      throw error;
    }
  };
  
  // Update settings
  const updateSettings = async (newSettings: AISettings): Promise<boolean> => {
    try {
      await updateSettingsMutation.mutateAsync(newSettings);
      return true;
    } catch (error) {
      console.error("Failed to update settings:", error);
      return false;
    }
  };
  
  // Add knowledge
  const addKnowledge = async (data: { title: string; content: string; role?: AIAssistantRole }) => {
    try {
      return await addKnowledgeMutation.mutateAsync(data);
    } catch (error) {
      console.error("Failed to add knowledge:", error);
      throw error;
    }
  };
  
  // Delete knowledge
  const deleteKnowledge = async (id: string) => {
    try {
      return await deleteKnowledgeMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete knowledge:", error);
      throw error;
    }
  };
  
  return (
    <AISettingsContext.Provider value={{
      settings,
      isLoadingSettings,
      error,
      updateSettings,
      canUseAI,
      createDefaultSettings,
      isCreatingSettings: createSettingsMutation.isPending,
      knowledgeUploads,
      isLoadingKnowledge,
      addKnowledge,
      deleteKnowledge,
      isAddingKnowledge: addKnowledgeMutation.isPending
    }}>
      {children}
    </AISettingsContext.Provider>
  );
};

export const useAISettings = (): AISettingsContextType => {
  const context = useContext(AISettingsContext);
  if (context === undefined) {
    throw new Error('useAISettings must be used within an AISettingsProvider');
  }
  return context;
};
