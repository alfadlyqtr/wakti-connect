
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'ar' | 'es' | 'fr' | 'de';

interface VoiceSettingsState {
  autoSilenceDetection: boolean;
  visualFeedback: boolean;
  language: Language;
  voiceEnabled: boolean;
  toggleAutoSilenceDetection: () => void;
  toggleVisualFeedback: () => void;
  setLanguage: (language: Language) => void;
  toggleVoiceEnabled: () => void;
  resetSettings: () => void;
}

export const useVoiceSettings = create<VoiceSettingsState>()(
  persist(
    (set) => ({
      autoSilenceDetection: true,
      visualFeedback: true,
      language: 'en',
      voiceEnabled: true,
      
      toggleAutoSilenceDetection: () => 
        set((state) => ({ autoSilenceDetection: !state.autoSilenceDetection })),
      
      toggleVisualFeedback: () => 
        set((state) => ({ visualFeedback: !state.visualFeedback })),
      
      setLanguage: (language) => 
        set({ language }),
      
      toggleVoiceEnabled: () => 
        set((state) => ({ voiceEnabled: !state.voiceEnabled })),
      
      resetSettings: () => 
        set({ 
          autoSilenceDetection: true, 
          visualFeedback: true, 
          language: 'en',
          voiceEnabled: true 
        })
    }),
    {
      name: 'wakti-voice-settings',
    }
  )
);
