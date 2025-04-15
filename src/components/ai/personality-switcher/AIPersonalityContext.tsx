
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AIPersonality, AIPersonalityMode } from './types';
import { personalityPresets } from './personalityPresets';

interface AIPersonalityContextType {
  currentMode: AIPersonalityMode;
  setCurrentMode: (mode: AIPersonalityMode) => void;
  currentPersonality: AIPersonality;
  previousMode: AIPersonalityMode | null;
  themeClass: string;
  getBackgroundStyle: () => string;
  getInputGlowClass: (isFocused: boolean) => string;
}

const AIPersonalityContext = createContext<AIPersonalityContextType | undefined>(undefined);

export const AIPersonalityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage or default to 'general' mode
  const [currentMode, setCurrentMode] = useState<AIPersonalityMode>(() => {
    const savedMode = localStorage.getItem('wakti-ai-mode');
    return (savedMode as AIPersonalityMode) || 'general';
  });
  
  // Track previous mode for transition effects
  const [previousMode, setPreviousMode] = useState<AIPersonalityMode | null>(null);

  // Get the current personality based on the mode
  const currentPersonality = personalityPresets[currentMode];

  // Update previous mode when current mode changes
  const handleModeChange = (newMode: AIPersonalityMode) => {
    setPreviousMode(currentMode);
    setCurrentMode(newMode);
  };

  // Get background class for current mode
  const getThemeClass = () => {
    switch (currentMode) {
      case 'general':
        return 'ai-bg-general';
      case 'student':
        return 'ai-bg-student';
      case 'productivity':
        return 'ai-bg-productivity';
      case 'creative':
        return 'ai-bg-creative';
      default:
        return 'ai-bg-general';
    }
  };
  
  // Get page background style based on current mode
  const getBackgroundStyle = () => {
    switch (currentMode) {
      case 'general':
        return 'bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900/70 dark:to-blue-950/50';
      case 'student':
        return 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-emerald-950/50 dark:to-green-900/70';
      case 'productivity':
        return 'bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950/50 dark:to-indigo-900/70';
      case 'creative':
        return 'bg-gradient-to-br from-pink-50 to-orange-100 dark:from-pink-950/50 dark:to-orange-900/70';
      default:
        return 'bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900/70 dark:to-blue-950/50';
    }
  };
  
  // Get input glow effect based on mode
  const getInputGlowClass = (isFocused: boolean) => {
    if (!isFocused) return '';
    
    switch (currentMode) {
      case 'general':
        return 'input-glow-general';
      case 'student':
        return 'input-glow-student';
      case 'productivity':
        return 'input-glow-productivity';
      case 'creative':
        return 'input-glow-creative';
      default:
        return 'input-glow-general';
    }
  };

  // Save the current mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wakti-ai-mode', currentMode);
  }, [currentMode]);

  return (
    <AIPersonalityContext.Provider
      value={{ 
        currentMode, 
        setCurrentMode: handleModeChange, 
        currentPersonality,
        previousMode,
        themeClass: getThemeClass(),
        getBackgroundStyle,
        getInputGlowClass
      }}
    >
      {children}
    </AIPersonalityContext.Provider>
  );
};

export const useAIPersonality = () => {
  const context = useContext(AIPersonalityContext);
  if (!context) {
    throw new Error('useAIPersonality must be used within an AIPersonalityProvider');
  }
  return context;
};
