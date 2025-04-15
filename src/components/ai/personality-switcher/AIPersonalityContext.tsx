
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AIPersonality, AIPersonalityMode } from './types';
import { personalityPresets } from './personalityPresets';

interface AIPersonalityContextType {
  currentMode: AIPersonalityMode;
  setCurrentMode: (mode: AIPersonalityMode) => void;
  currentPersonality: AIPersonality;
  previousMode: AIPersonalityMode | null;
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
        previousMode
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
