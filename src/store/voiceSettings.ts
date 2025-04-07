
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VoiceSettings {
  autoSilenceDetection: boolean;
  visualFeedback: boolean;
  language: 'en' | 'ar';
}

interface VoiceSettingsState extends VoiceSettings {
  toggleAutoSilenceDetection: () => void;
  toggleVisualFeedback: () => void;
  setLanguage: (language: 'en' | 'ar') => void;
  resetSettings: () => void;
}

const defaultSettings: VoiceSettings = {
  autoSilenceDetection: true,
  visualFeedback: true,
  language: 'en',
};

export const useVoiceSettings = create<VoiceSettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      toggleAutoSilenceDetection: () => 
        set((state) => ({ autoSilenceDetection: !state.autoSilenceDetection })),
      
      toggleVisualFeedback: () => 
        set((state) => ({ visualFeedback: !state.visualFeedback })),
      
      setLanguage: (language: 'en' | 'ar') => 
        set(() => ({ language })),
      
      resetSettings: () => 
        set(() => ({ ...defaultSettings })),
    }),
    {
      name: 'wakti-voice-settings',
    }
  )
);
