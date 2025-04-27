
import { WAKTIAIMode } from '@/types/ai-assistant.types';

export type AIPersonalityMode = WAKTIAIMode;

export interface AIPersonality {
  id: string;
  name: string;
  systemPrompt: string;
  description: string;
  welcomeMessage?: string; // Make this optional
  suggestedPrompts?: string[];
  color: string;
  mode?: WAKTIAIMode;
  title: string;
  gradient?: string;
  bgGradient?: string;
  iconColor?: string;
  lightTheme?: {
    backgroundColor: string;
    chatBgColor: string;
    messageColor: string;
    accentColor: string;
  };
  darkTheme?: {
    backgroundColor: string;
    chatBgColor: string;
    messageColor: string;
    accentColor: string;
  };
}

export interface ChatMemoryMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  mode?: WAKTIAIMode;
  imageUrl?: string | null; // Add support for images in messages
}

export interface AIPersonalityContextType {
  currentPersonality: AIPersonality;
  currentMode: WAKTIAIMode;
  personalities: AIPersonality[];
  setCurrentMode: (mode: WAKTIAIMode) => void;
}
