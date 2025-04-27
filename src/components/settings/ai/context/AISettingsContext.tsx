
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type Json } from '@/types/supabase';
import { WAKTIAIMode, AISettings, AIKnowledgeUpload } from '@/components/ai/personality-switcher/types';

// Type alias to ensure consistency
type AIAssistantRole = WAKTIAIMode; 

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
  const [error, setError] = useState<Error | null>(null);
  const [knowledgeUploads, setKnowledgeUploads] = useState<AIKnowledgeUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('ai_settings')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (error) {
          // If settings don't exist, create default settings
          if (error.code === 'PGRST116') {
            await createDefaultSettings(session.user.id);
            return;
          }
          throw new Error(error.message);
        }
        
        setSettings(data as AISettings);
        await fetchKnowledgeUploads(session.user.id);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch AI settings'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const createDefaultSettings = async (userId: string) => {
    try {
      const defaultSettings: AISettings = {
        user_id: userId,
        assistant_name: 'WAKTI Assistant',
        role: 'general' as WAKTIAIMode, // Make sure this is one of the allowed values
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
      
      // Convert to a type that matches the database schema
      // This cast ensures TypeScript doesn't complain about the role type
      const dbSettings = {
        ...defaultSettings,
        role: defaultSettings.role as "general" | "student" | "employee" | "writer" | "business_owner"
      };
      
      const { error } = await supabase
        .from('ai_settings')
        .insert([dbSettings]);
      
      if (error) throw new Error(error.message);
      
      setSettings(defaultSettings);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create default AI settings'));
    }
  };
  
  const fetchKnowledgeUploads = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_knowledge')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw new Error(error.message);
      
      // Transform the data to match our expected AIKnowledgeUpload type
      const transformedData: AIKnowledgeUpload[] = data.map(item => ({
        ...item,
        name: item.title || 'Untitled', 
        type: 'document',
        size: item.content ? item.content.length : 0,
        upload_date: item.created_at,
        status: 'complete' as const,
        role: 'general'
      }));
      
      setKnowledgeUploads(transformedData);
    } catch (err) {
      console.error('Error fetching knowledge uploads:', err);
    }
  };
  
  const updateSetting = async <K extends keyof AISettings>(key: K, value: AISettings[K]) => {
    if (!settings) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');
      
      const { error } = await supabase
        .from('ai_settings')
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
      
      const { error } = await supabase
        .from('ai_settings')
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
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');
      
      const reader = new FileReader();
      
      const fileContent = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });
      
      const { data, error } = await supabase
        .from('ai_knowledge')
        .insert({
          user_id: session.user.id,
          title,
          content: fileContent
        })
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      
      // Convert the returned data to match our AIKnowledgeUpload type
      const newUpload: AIKnowledgeUpload = {
        ...data,
        name: data.title,
        type: 'document',
        size: fileContent.length,
        upload_date: data.created_at,
        status: 'complete' as const,
        role: 'general'
      };
      
      setKnowledgeUploads(prev => [...prev, newUpload]);
    } catch (err) {
      setUploadError(err instanceof Error ? err : new Error('Failed to upload knowledge document'));
    } finally {
      setIsUploading(false);
    }
  };
  
  const deleteKnowledge = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ai_knowledge')
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
      }}
    >
      {children}
    </AISettingsContext.Provider>
  );
};
