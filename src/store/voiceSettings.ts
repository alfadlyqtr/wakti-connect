
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VoiceSettings {
  autoSilenceDetection: boolean;
  visualFeedback: boolean;
  silenceThreshold: number;
  maxRecordingDuration: number;
  toggleAutoSilenceDetection: () => void;
  toggleVisualFeedback: () => void;
  setSilenceThreshold: (value: number) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

export const useVoiceSettings = create<VoiceSettings>()(
  persist(
    (set) => ({
      autoSilenceDetection: true,
      visualFeedback: true,
      silenceThreshold: -45,
      maxRecordingDuration: 300,
      language: 'en-US',
      toggleAutoSilenceDetection: () =>
        set((state) => ({ autoSilenceDetection: !state.autoSilenceDetection })),
      toggleVisualFeedback: () =>
        set((state) => ({ visualFeedback: !state.visualFeedback })),
      setSilenceThreshold: (value: number) => set({ silenceThreshold: value }),
      setLanguage: (lang: string) => set({ language: lang }),
    }),
    {
      name: 'voice-settings',
    }
  )
);
