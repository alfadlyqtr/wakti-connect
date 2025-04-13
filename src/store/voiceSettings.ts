
import { create } from 'zustand';

interface VoiceSettingsState {
  autoSilenceDetection: boolean;
  language: 'en' | 'ar';
  toggleAutoSilenceDetection: () => void;
  setLanguage: (lang: 'en' | 'ar') => void;
}

export const useVoiceSettings = create<VoiceSettingsState>((set) => ({
  autoSilenceDetection: true,
  language: 'en',
  
  toggleAutoSilenceDetection: () => set((state) => ({ 
    autoSilenceDetection: !state.autoSilenceDetection 
  })),
  
  setLanguage: (lang: 'en' | 'ar') => set({ language: lang })
}));
