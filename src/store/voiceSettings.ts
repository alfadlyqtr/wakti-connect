
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'ar' | 'auto';

interface VoiceSettingsState {
  autoSilenceDetection: boolean;
  visualFeedback: boolean;
  language: Language;
  voiceEnabled: boolean;
  silenceThreshold: number;
  maxRecordingDuration: number; // in seconds
  toggleAutoSilenceDetection: () => void;
  toggleVisualFeedback: () => void;
  setLanguage: (language: Language) => void;
  toggleVoiceEnabled: () => void;
  setSilenceThreshold: (threshold: number) => void;
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
      silenceThreshold: 0.05,
      maxRecordingDuration: 2700, // 45 minutes in seconds
      
      toggleAutoSilenceDetection: () => 
        set((state) => ({ autoSilenceDetection: !state.autoSilenceDetection })),
      
      toggleVisualFeedback: () => 
        set((state) => ({ visualFeedback: !state.visualFeedback })),
      
      setLanguage: (language) => 
        set({ language }),
      
      toggleVoiceEnabled: () => 
        set((state) => ({ voiceEnabled: !state.voiceEnabled })),
      
      setSilenceThreshold: (threshold) =>
        set({ silenceThreshold: threshold }),
        
      setMaxRecordingDuration: (duration) =>
        set({ maxRecordingDuration: duration }),
      
      resetSettings: () => 
        set({ 
          autoSilenceDetection: true, 
          visualFeedback: true, 
          language: 'en',
          voiceEnabled: true,
          silenceThreshold: 0.05,
          maxRecordingDuration: 2700
        })
    }),
    {
      name: 'wakti-voice-settings',
    }
  )
);
