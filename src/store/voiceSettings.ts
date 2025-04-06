
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VoiceSettings {
  autoSilenceDetection: boolean;
  visualFeedback: boolean;
  language: string;
  toggleAutoSilenceDetection: () => void;
  toggleVisualFeedback: () => void;
  setLanguage: (language: string) => void;
  resetSettings: () => void;
}

export const useVoiceSettings = create<VoiceSettings>()(
  persist(
    (set) => ({
      // Default settings
      autoSilenceDetection: true,
      visualFeedback: true,
      language: 'en', // Default to English
      
      // Actions
      toggleAutoSilenceDetection: () => 
        set((state) => ({ autoSilenceDetection: !state.autoSilenceDetection })),
      
      toggleVisualFeedback: () => 
        set((state) => ({ visualFeedback: !state.visualFeedback })),
      
      setLanguage: (language: string) => 
        set({ language }),
      
      resetSettings: () => 
        set({ 
          autoSilenceDetection: true, 
          visualFeedback: true,
          language: 'en'
        }),
    }),
    {
      name: 'voice-settings', // Unique name for localStorage
    }
  )
);
