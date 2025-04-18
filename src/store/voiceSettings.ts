
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'ar' | 'es' | 'fr' | 'de' | 'auto';

interface VoiceSettingsState {
  autoSilenceDetection: boolean;
  visualFeedback: boolean;
  language: Language;
  voiceEnabled: boolean;
  maxRecordingDuration: number; // in seconds
  toggleAutoSilenceDetection: () => void;
  toggleVisualFeedback: () => void;
  setLanguage: (language: Language) => void;
  toggleVoiceEnabled: () => void;
  setMaxRecordingDuration: (duration: number) => void;
  resetSettings: () => void;
}

export const useVoiceSettings = create<VoiceSettingsState>()(
  persist(
    (set) => ({
      autoSilenceDetection: true,
      visualFeedback: true,
      language: 'en',
      voiceEnabled: true,
      maxRecordingDuration: 2700, // 45 minutes default
      
      toggleAutoSilenceDetection: () => 
        set((state) => ({ autoSilenceDetection: !state.autoSilenceDetection })),
      
      toggleVisualFeedback: () => 
        set((state) => ({ visualFeedback: !state.visualFeedback })),
      
      setLanguage: (language) => 
        set({ language }),
      
      toggleVoiceEnabled: () => 
        set((state) => ({ voiceEnabled: !state.voiceEnabled })),
      
      setMaxRecordingDuration: (duration) =>
        set({ maxRecordingDuration: duration }),
      
      resetSettings: () => 
        set({ 
          autoSilenceDetection: true, 
          visualFeedback: true, 
          language: 'en',
          voiceEnabled: true,
          maxRecordingDuration: 2700
        })
    }),
    {
      name: 'wakti-voice-settings',
    }
  )
);
