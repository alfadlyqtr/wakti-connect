
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VoiceSettings {
  // Voice capabilities
  autoSilenceDetection: boolean;
  toggleAutoSilenceDetection: () => void;
  visualFeedback: boolean;
  toggleVisualFeedback: () => void;
  
  // Language preferences
  language: string;
  setLanguage: (language: string) => void;
  
  // Voice preferences
  preferredVoice: {
    english: string;
    arabic: string;
  };
  setPreferredVoice: (language: 'english' | 'arabic', voice: string) => void;
}

export const useVoiceSettings = create<VoiceSettings>()(
  persist(
    (set) => ({
      // Voice capabilities
      autoSilenceDetection: true,
      toggleAutoSilenceDetection: () => set((state) => ({ autoSilenceDetection: !state.autoSilenceDetection })),
      visualFeedback: true,
      toggleVisualFeedback: () => set((state) => ({ visualFeedback: !state.visualFeedback })),
      
      // Language preferences
      language: 'en',
      setLanguage: (language) => set({ language }),
      
      // Voice preferences
      preferredVoice: {
        english: 'John',
        arabic: 'Hareth',
      },
      setPreferredVoice: (language, voice) => set((state) => ({
        preferredVoice: {
          ...state.preferredVoice,
          [language]: voice,
        },
      })),
    }),
    {
      name: 'wakti-voice-settings',
    }
  )
);
