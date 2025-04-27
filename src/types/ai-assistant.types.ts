
import { ReactNode } from 'react';

export type WAKTIAIMode = 'general' | 'student' | 'productivity' | 'creative';
export type AIAssistantRole = WAKTIAIMode;

export interface AIPersonality {
  id: string;
  name: string;
  systemPrompt: string;
  icon: string;
  color: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  mode?: WAKTIAIMode;
}

export interface AISettings {
  id?: string;
  name: string;
  tone: 'professional' | 'friendly' | 'balanced' | 'formal' | 'casual';
  response_length: 'concise' | 'balanced' | 'detailed';
  proactiveness: boolean;
  suggestion_frequency: 'low' | 'medium' | 'high';
  enabled_features: {
    voice_input: boolean;
    voice_output: boolean;
    task_detection: boolean;
    meeting_scheduling: boolean;
    personalized_suggestions: boolean;
  };
}

export interface AIKnowledgeUpload {
  id: string;
  name: string;
  type: string;
  size: number;
  upload_date: Date;
  status: 'processing' | 'ready' | 'error';
  description?: string;
}

// Define role contexts for the assistant to use in different modes
export const RoleContexts = {
  general: {
    title: 'AI Assistant',
    description: 'Helping with general questions and tasks',
    welcomeMessage: 'Hello! How can I assist you with your business today?',
    icon: 'bot',
  },
  student: {
    title: 'Learning Assistant',
    description: 'Helping with learning and education',
    welcomeMessage: 'Hello! What would you like to learn about today?',
    icon: 'graduation-cap',
  },
  productivity: {
    title: 'Productivity Assistant',
    description: 'Helping with tasks and productivity',
    welcomeMessage: 'Hello! I can help you manage tasks and improve productivity. What would you like to focus on?',
    icon: 'list-check',
  },
  creative: {
    title: 'Creative Assistant',
    description: 'Helping with creative projects',
    welcomeMessage: 'Hello! Let\'s unleash your creativity today. What would you like to create?',
    icon: 'sparkles',
  }
};

// Define WAKTIAIModes with colors and default prompts for UI representation
export const WAKTIAIModes = {
  general: {
    color: 'bg-blue-600',
    defaultPrompt: 'I can help you with general questions, business tasks, and more. How can I assist you today?',
  },
  student: {
    color: 'bg-green-600',
    defaultPrompt: 'I can help with learning, explaining concepts, study planning, and educational resources. What would you like to learn?',
  },
  productivity: {
    color: 'bg-purple-600',
    defaultPrompt: 'I can help you organize tasks, plan your schedule, and improve productivity. What would you like to focus on?',
  },
  creative: {
    color: 'bg-pink-600',
    defaultPrompt: 'Let\'s explore creative ideas, content creation, or brainstorming. What would you like to create today?',
  },
};
