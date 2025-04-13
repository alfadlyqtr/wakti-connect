
import { useState, useEffect } from 'react';
import { AISettings, AIAssistantRole } from '@/types/ai-assistant.types';

const defaultSettings: AISettings = {
  role: 'general',
  language: 'en',
  voiceEnabled: false,
  memoryEnabled: true,
  includePersonalContext: true
};

export const useAISettings = () => {
  const [aiSettings, setAISettings] = useState<AISettings>(defaultSettings);
  const [isLoadingSettings, setIsLoadingSettings] = useState<boolean>(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // In a real implementation, this would fetch from an API or local storage
        // For now, we'll just use the default settings
        setAISettings(defaultSettings);
        setIsLoadingSettings(false);
      } catch (error) {
        console.error('Error loading AI settings:', error);
        setIsLoadingSettings(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<AISettings>) => {
    try {
      // In a real implementation, this would save to an API or local storage
      setAISettings(prev => ({ ...prev, ...newSettings }));
      return true;
    } catch (error) {
      console.error('Error updating AI settings:', error);
      return false;
    }
  };

  const canUseAI = () => {
    // This would be based on user subscription level in a real implementation
    return true;
  };

  return {
    aiSettings,
    isLoadingSettings,
    updateSettings,
    canUseAI
  };
};
