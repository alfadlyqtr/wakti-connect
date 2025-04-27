
import React, { createContext, useContext, useState, useCallback } from 'react';
import { WAKTIAIMode, AIPersonality, WAKTIAIModes } from '@/types/ai-assistant.types';

interface AIPersonalityContextType {
  currentMode: WAKTIAIMode;
  setCurrentMode: (mode: WAKTIAIMode) => void;
  currentPersonality: AIPersonality;
  getInputGlowClass: (isFocused: boolean) => string;
}

const defaultPersonalities: Record<WAKTIAIMode, AIPersonality> = {
  general: {
    id: 'general',
    name: 'General',
    systemPrompt: 'You are WAKTI, a helpful AI assistant for business management.',
    icon: 'bot',
    color: 'blue',
    title: 'General Assistant',
    description: 'Help with various tasks and questions'
  },
  student: {
    id: 'student',
    name: 'Learning',
    systemPrompt: 'You are WAKTI, an AI tutor helping with learning and education.',
    icon: 'graduation-cap',
    color: 'green',
    title: 'Learning Assistant',
    description: 'Support for students and learning'
  },
  productivity: {
    id: 'productivity',
    name: 'Productivity',
    systemPrompt: 'You are WAKTI, an AI assistant focused on productivity and task management.',
    icon: 'list-checks',
    color: 'purple',
    title: 'Productivity Assistant',
    description: 'Boost your productivity and organization'
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    systemPrompt: 'You are WAKTI, an AI designed to help with creative tasks and brainstorming.',
    icon: 'sparkles',
    color: 'pink',
    title: 'Creative Assistant',
    description: 'Unleash your creativity'
  },
  employee: {
    id: 'employee',
    name: 'Work',
    systemPrompt: 'You are WAKTI, an AI assistant for workplace communication and tasks.',
    icon: 'briefcase',
    color: 'indigo',
    title: 'Work Assistant',
    description: 'Support for workplace tasks'
  },
  writer: {
    id: 'writer',
    name: 'Writer',
    systemPrompt: 'You are WAKTI, an AI assistant for writing and content creation.',
    icon: 'pen',
    color: 'emerald',
    title: 'Writer Assistant',
    description: 'Assistance for writers and content creators'
  },
  business_owner: {
    id: 'business_owner',
    name: 'Business',
    systemPrompt: 'You are WAKTI, an AI assistant for business owners and managers.',
    icon: 'building',
    color: 'amber',
    title: 'Business Assistant',
    description: 'Support for business owners and managers'
  }
};

const AIPersonalityContext = createContext<AIPersonalityContextType>({
  currentMode: 'general',
  setCurrentMode: () => {},
  currentPersonality: defaultPersonalities.general,
  getInputGlowClass: () => ''
});

export const AIPersonalityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMode, setCurrentMode] = useState<WAKTIAIMode>('general');
  
  // Get input glow class based on the current mode
  const getInputGlowClass = useCallback((isFocused: boolean) => {
    if (!isFocused) return '';
    
    switch (currentMode) {
      case 'general': return 'focus:border-blue-500/50 focus:ring-blue-500/20';
      case 'student': return 'focus:border-green-500/50 focus:ring-green-500/20';
      case 'productivity': return 'focus:border-purple-500/50 focus:ring-purple-500/20';
      case 'creative': return 'focus:border-pink-500/50 focus:ring-pink-500/20';
      case 'employee': return 'focus:border-indigo-500/50 focus:ring-indigo-500/20';
      case 'writer': return 'focus:border-emerald-500/50 focus:ring-emerald-500/20';
      case 'business_owner': return 'focus:border-amber-500/50 focus:ring-amber-500/20';
      default: return 'focus:border-blue-500/50 focus:ring-blue-500/20';
    }
  }, [currentMode]);
  
  const personalityContextValue = {
    currentMode,
    setCurrentMode,
    currentPersonality: defaultPersonalities[currentMode],
    getInputGlowClass
  };
  
  return (
    <AIPersonalityContext.Provider value={personalityContextValue}>
      {children}
    </AIPersonalityContext.Provider>
  );
};

export const useAIPersonality = () => useContext(AIPersonalityContext);
