
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VoiceSettings {
  autoSilenceDetection: boolean;
  visualFeedback: boolean;
  voice: string; // Default voice identifier
}

interface VoiceSettingsState extends VoiceSettings {
  toggleAutoSilenceDetection: () => void;
  toggleVisualFeedback: () => void;
  updateVoice: (voice: string) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: VoiceSettings = {
  autoSilenceDetection: true,
  visualFeedback: true,
  voice: 'default', // Default voice
};

export const useVoiceSettings = create<VoiceSettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      
      toggleAutoSilenceDetection: () => 
        set((state) => ({ autoSilenceDetection: !state.autoSilenceDetection })),
      
      toggleVisualFeedback: () => 
        set((state) => ({ visualFeedback: !state.visualFeedback })),
        
      updateVoice: (voice: string) => 
        set({ voice }),
      
      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'wakti-voice-settings',
    }
  )
);
