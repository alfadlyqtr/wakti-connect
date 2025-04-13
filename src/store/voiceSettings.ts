
import { create } from 'zustand';

interface VoiceSettingsState {
  autoSilenceDetection: boolean;
  language: 'en' | 'ar' | 'es' | 'fr' | 'de';
  visualFeedback: boolean;
  toggleAutoSilenceDetection: () => void;
  setLanguage: (lang: 'en' | 'ar' | 'es' | 'fr' | 'de') => void;
  toggleVisualFeedback: () => void;
  resetSettings: () => void;
}

const defaultSettings = {
  autoSilenceDetection: true,
  language: 'en' as const,
  visualFeedback: true,
};

export const useVoiceSettings = create<VoiceSettingsState>((set) => ({
  ...defaultSettings,
  
  toggleAutoSilenceDetection: () => set((state) => ({ 
    autoSilenceDetection: !state.autoSilenceDetection 
  })),
  
  setLanguage: (lang: 'en' | 'ar' | 'es' | 'fr' | 'de') => set({ 
    language: lang 
  }),
  
  toggleVisualFeedback: () => set((state) => ({
    visualFeedback: !state.visualFeedback
  })),
  
  resetSettings: () => set(defaultSettings)
}));
