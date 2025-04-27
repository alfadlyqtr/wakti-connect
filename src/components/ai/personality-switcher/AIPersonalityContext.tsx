
import React, { createContext, useContext, useState, useCallback } from 'react';
import { WAKTIAIMode, AIPersonality } from '@/types/ai-assistant.types';

interface AIPersonalityContextType {
  currentMode: WAKTIAIMode;
  setCurrentMode: (mode: WAKTIAIMode) => void;
  currentPersonality: AIPersonality;
}

const defaultPersonalities: Record<WAKTIAIMode, AIPersonality> = {
  general: {
    id: 'general',
    name: 'General',
    systemPrompt: 'You are WAKTI, a helpful AI assistant for business management.',
    icon: 'bot',
    color: 'blue',
  },
  student: {
    id: 'student',
    name: 'Learning',
    systemPrompt: 'You are WAKTI, an AI tutor helping with learning and education.',
    icon: 'graduation-cap',
    color: 'green',
  },
  productivity: {
    id: 'productivity',
    name: 'Productivity',
    systemPrompt: 'You are WAKTI, an AI assistant focused on productivity and task management.',
    icon: 'list-checks',
    color: 'purple',
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    systemPrompt: 'You are WAKTI, an AI designed to help with creative tasks and brainstorming.',
    icon: 'sparkles',
    color: 'pink',
  }
};

const AIPersonalityContext = createContext<AIPersonalityContextType>({
  currentMode: 'general',
  setCurrentMode: () => {},
  currentPersonality: defaultPersonalities.general,
});

export const AIPersonalityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMode, setCurrentMode] = useState<WAKTIAIMode>('general');
  
  const personalityContextValue = {
    currentMode,
    setCurrentMode,
    currentPersonality: defaultPersonalities[currentMode],
  };
  
  return (
    <AIPersonalityContext.Provider value={personalityContextValue}>
      {children}
    </AIPersonalityContext.Provider>
  );
};

export const useAIPersonality = () => useContext(AIPersonalityContext);
