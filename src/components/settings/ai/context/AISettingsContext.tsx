
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WAKTIAIMode, AISettings, AIKnowledgeUpload } from '@/components/ai/personality-switcher/types';

// Define a minimal Json type if we can't import it from Supabase types
type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

interface AISettingsContextType {
  settings: AISettings | null;
  isLoading: boolean;
  error: Error | null;
  updateSetting: <K extends keyof AISettings>(key: K, value: AISettings[K]) => Promise<void>;
  updateFeature: (feature: keyof AISettings['enabled_features'], value: boolean) => Promise<void>;
  knowledgeUploads: AIKnowledgeUpload[];
  uploadKnowledge: (file: File, title: string) => Promise<void>;
  deleteKnowledge: (id: string) => Promise<void>;
  isUploading: boolean;
  uploadError: Error | null;
  
  // Add missing properties
  isLoadingSettings: boolean;
  canUseAI: boolean;
  createDefaultSettings: () => Promise<void>;
  isCreatingSettings: boolean;
  isLoadingKnowledge: boolean;
  addKnowledge: (file: File, title: string) => Promise<void>;
  isAddingKnowledge: boolean;
  updateSettings: (settings: AISettings) => Promise<void>;
  isUpdatingSettings: boolean;
}

const AISettingsContext = createContext<AISettingsContextType | undefined>(undefined);

export const useAISettings = () => {
  const context = useContext(AISettingsContext);
  if (context === undefined) {
    throw new Error('useAISettings must be used within an AISettingsProvider');
  }
  return context;
};

interface AISettingsProviderProps {
  children: React.ReactNode;
}

export const AISettingsProvider: React.FC<AISettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [knowledgeUploads, setKnowledgeUploads] = useState<AIKnowledgeUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const [isCreatingSettings, setIsCreatingSettings] = useState(false);
  const [isLoadingKnowledge, setIsLoadingKnowledge] = useState(false);
  const [isAddingKnowledge, setIsAddingKnowledge] = useState(false);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [canUseAI, setCanUseAI] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setIsLoadingSettings(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsLoading(false);
          setIsLoadingSettings(false);
          return;
        }
        
        // Changed to use ai_assistant_settings table instead of ai_settings
        const { data, error } = await supabase
          .from('ai_assistant_settings')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (error) {
          // If settings don't exist, create default settings
          if (error.code === 'PGRST116') {
            await createDefaultSettings();
            return;
          }
          throw new Error(error.message);
        }
        
        // Convert database data to AISettings type
        const settingsData: AISettings = {
          user_id: data.user_id,
          assistant_name: data.assistant_name || 'WAKTI Assistant',
          role: data.role || 'general',
          tone: data.tone || 'friendly',
          response_length: data.response_length || 'medium',
          proactiveness: !!data.proactiveness,
          suggestion_frequency: data.suggestion_frequency || 'medium',
          enabled_features: data.enabled_features as AISettings['enabled_features'] || {
            voice_input: true,
            voice_output: false,
            task_detection: true,
            meeting_scheduling: true,
            personalized_suggestions: true,
            tasks: true,
            events: true,
            staff: true,
            analytics: true,
            messaging: true
          }
        };
        
        setSettings(settingsData);
        await fetchKnowledgeUploads(session.user.id);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch AI settings'));
      } finally {
        setIsLoading(false);
        setIsLoadingSettings(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const createDefaultSettings = async () => {
    try {
      setIsCreatingSettings(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');
      
      const defaultSettings: AISettings = {
        user_id: session.user.id,
        assistant_name: 'WAKTI Assistant',
        role: 'general', // Make sure this is one of the allowed values
        tone: 'friendly',
        response_length: 'medium',
        proactiveness: true,
        suggestion_frequency: 'medium',
        enabled_features: {
          voice_input: true,
          voice_output: false,
          task_detection: true,
          meeting_scheduling: true,
          personalized_suggestions: true,
          tasks: true,
          events: true,
          staff: true,
          analytics: true,
          messaging: true
        }
      };
      
      // Use ai_assistant_settings table for Supabase
      const { error } = await supabase
        .from('ai_assistant_settings')
        .insert([{
          user_id: defaultSettings.user_id,
          assistant_name: defaultSettings.assistant_name,
          role: defaultSettings.role,
          tone: defaultSettings.tone,
          response_length: defaultSettings.response_length,
          proactiveness: defaultSettings.proactiveness,
          suggestion_frequency: defaultSettings.suggestion_frequency,
          enabled_features: defaultSettings.enabled_features
        }]);
      
      if (error) throw new Error(error.message);
      
      setSettings(defaultSettings);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create default AI settings'));
    } finally {
      setIsCreatingSettings(false);
    }
  };
  
  const fetchKnowledgeUploads = async (userId: string) => {
    try {
      setIsLoadingKnowledge(true);
      const { data, error } = await supabase
        .from('ai_knowledge_uploads')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw new Error(error.message);
      
      // Transform the data to match our expected AIKnowledgeUpload type
      const transformedData: AIKnowledgeUpload[] = data.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        title: item.title || 'Untitled',
        content: item.content,
        created_at: item.created_at,
        updated_at: item.updated_at,
        name: item.title || 'Untitled', 
        type: item.type || 'document',
        size: item.content ? item.content.length : 0,
        upload_date: item.created_at,
        status: 'complete' as const,
        role: item.role || 'general'
      }));
      
      setKnowledgeUploads(transformedData);
    } catch (err) {
      console.error('Error fetching knowledge uploads:', err);
    } finally {
      setIsLoadingKnowledge(false);
    }
  };
  
  const updateSettings = async (updatedSettings: AISettings) => {
    if (!settings) return;
    
    try {
      setIsUpdatingSettings(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');
      
      // Update the settings in Supabase
      const { error } = await supabase
        .from('ai_assistant_settings')
        .update({
          assistant_name: updatedSettings.assistant_name,
          role: updatedSettings.role,
          tone: updatedSettings.tone,
          response_length: updatedSettings.response_length,
          proactiveness: updatedSettings.proactiveness,
          suggestion_frequency: updatedSettings.suggestion_frequency,
          enabled_features: updatedSettings.enabled_features
        })
        .eq('user_id', session.user.id);
      
      if (error) throw new Error(error.message);
      
      setSettings(updatedSettings);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update AI settings'));
    } finally {
      setIsUpdatingSettings(false);
    }
  };
  
  const updateSetting = async <K extends keyof AISettings>(key: K, value: AISettings[K]) => {
    if (!settings) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');
      
      // Use ai_assistant_settings table for Supabase
      const { error } = await supabase
        .from('ai_assistant_settings')
        .update({ [key]: value })
        .eq('user_id', session.user.id);
      
      if (error) throw new Error(error.message);
      
      setSettings(prev => {
        if (!prev) return null;
        return { ...prev, [key]: value };
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to update ${String(key)}`));
    }
  };
  
  const updateFeature = async (feature: keyof AISettings['enabled_features'], value: boolean) => {
    if (!settings) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');
      
      const updatedFeatures = {
        ...settings.enabled_features,
        [feature]: value
      };
      
      // Use ai_assistant_settings table for Supabase
      const { error } = await supabase
        .from('ai_assistant_settings')
        .update({ enabled_features: updatedFeatures })
        .eq('user_id', session.user.id);
      
      if (error) throw new Error(error.message);
      
      setSettings(prev => {
        if (!prev) return null;
        return {
          ...prev,
          enabled_features: {
            ...prev.enabled_features,
            [feature]: value
          }
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to update feature ${feature}`));
    }
  };
  
  const uploadKnowledge = async (file: File, title: string) => {
    setIsUploading(true);
    setUploadError(null);
    setIsAddingKnowledge(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');
      
      const reader = new FileReader();
      
      const fileContent = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });
      
      // Use ai_knowledge_uploads table for Supabase
      const { data, error } = await supabase
        .from('ai_knowledge_uploads')
        .insert({
          user_id: session.user.id,
          title,
          content: fileContent,
          type: file.type,
          size: file.size
        })
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      
      // Convert the returned data to match our AIKnowledgeUpload type
      const newUpload: AIKnowledgeUpload = {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        content: data.content,
        created_at: data.created_at,
        updated_at: data.updated_at,
        name: data.title,
        type: file.type || 'document',
        size: file.size,
        upload_date: data.created_at,
        status: 'complete' as const,
        role: 'general'
      };
      
      setKnowledgeUploads(prev => [...prev, newUpload]);
    } catch (err) {
      setUploadError(err instanceof Error ? err : new Error('Failed to upload knowledge document'));
    } finally {
      setIsUploading(false);
      setIsAddingKnowledge(false);
    }
  };
  
  // Alias for uploadKnowledge to match the interface
  const addKnowledge = uploadKnowledge;
  
  const deleteKnowledge = async (id: string) => {
    try {
      // Use ai_knowledge_uploads table for Supabase
      const { error } = await supabase
        .from('ai_knowledge_uploads')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      
      setKnowledgeUploads(prev => prev.filter(upload => upload.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete knowledge document'));
    }
  };
  
  return (
    <AISettingsContext.Provider
      value={{
        settings,
        isLoading,
        error,
        updateSetting,
        updateFeature,
        knowledgeUploads,
        uploadKnowledge,
        deleteKnowledge,
        isUploading,
        uploadError,
        isLoadingSettings,
        canUseAI,
        createDefaultSettings,
        isCreatingSettings,
        isLoadingKnowledge,
        addKnowledge,
        isAddingKnowledge,
        updateSettings,
        isUpdatingSettings,
      }}
    >
      {children}
    </AISettingsContext.Provider>
  );
};
