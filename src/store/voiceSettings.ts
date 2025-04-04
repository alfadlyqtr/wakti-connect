
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VoiceSettings {
  voice: string;
  autoSilenceDetection: boolean;
  visualFeedback: boolean;
}

interface VoiceSettingsState extends VoiceSettings {
  updateVoice: (voice: string) => void;
  toggleAutoSilenceDetection: () => void;
  toggleVisualFeedback: () => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: VoiceSettings = {
  voice: 'alloy', // OpenAI default voice
  autoSilenceDetection: true,
  visualFeedback: true,
};

export const useVoiceSettings = create<VoiceSettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      
      updateVoice: (voice) => set({ voice }),
      
      toggleAutoSilenceDetection: () => 
        set((state) => ({ autoSilenceDetection: !state.autoSilenceDetection })),
      
      toggleVisualFeedback: () => 
        set((state) => ({ visualFeedback: !state.visualFeedback })),
      
      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'wakti-voice-settings',
    }
  )
);
