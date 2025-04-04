
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VoiceSettings {
  autoSilenceDetection: boolean;
  visualFeedback: boolean;
}

interface VoiceSettingsState extends VoiceSettings {
  toggleAutoSilenceDetection: () => void;
  toggleVisualFeedback: () => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: VoiceSettings = {
  autoSilenceDetection: true,
  visualFeedback: true,
};

export const useVoiceSettings = create<VoiceSettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      
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
