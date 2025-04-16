
import { WAKTIAIMode } from '@/types/ai-assistant.types';

export interface AIPersonality {
  id: string;
  name: string;
  systemPrompt: string;
  description: string;
  welcomeMessage: string;
  suggestedPrompts: string[];
  color: string;
  mode: WAKTIAIMode;
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
