
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AIPersonality, WAKTIAIMode } from './types';
import { personalityPresets } from './personalityPresets';

interface AIPersonalityContextType {
  currentMode: WAKTIAIMode;
  setCurrentMode: (mode: WAKTIAIMode) => void;
  currentPersonality: AIPersonality;
  previousMode: WAKTIAIMode | null;
  themeClass: string;
  getBackgroundStyle: () => string;
  getInputGlowClass: (isFocused: boolean) => string;
}

const AIPersonalityContext = createContext<AIPersonalityContextType | undefined>(undefined);

export const AIPersonalityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage or default to 'general' mode
  const [currentMode, setCurrentMode] = useState<WAKTIAIMode>(() => {
    const savedMode = localStorage.getItem('wakti-ai-mode');
    return (savedMode as WAKTIAIMode) || 'general';
  });
  
  // Track previous mode for transition effects
  const [previousMode, setPreviousMode] = useState<WAKTIAIMode | null>(null);

  // Get the current personality based on the mode
  const currentPersonality = personalityPresets[currentMode] || personalityPresets.general;

  // Update previous mode when current mode changes
  const handleModeChange = (newMode: WAKTIAIMode) => {
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
        return 'bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200';
      case 'student':
        return 'bg-gradient-to-b from-green-50 via-green-100 to-green-200';
      case 'productivity':
        return 'bg-gradient-to-b from-yellow-50 via-orange-100 to-yellow-200';
      case 'creative':
        return 'bg-gradient-to-b from-purple-50 via-pink-100 to-purple-200';
      default:
        return 'bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200';
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
