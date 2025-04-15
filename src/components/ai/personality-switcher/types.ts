
export type AIPersonalityMode = 'general' | 'student' | 'productivity' | 'creative';

export interface AIPersonality {
  title: string;
  description: string;
  systemPrompt: string;
  welcomeMessage: string;
  suggestedPrompts: string[];
  color: string;
  gradient: string;
  bgGradient: string;
  iconColor: string;
  lightTheme: {
    backgroundColor: string;
    chatBgColor: string;
    messageColor: string;
    accentColor: string;
  };
  darkTheme: {
    backgroundColor: string;
    chatBgColor: string;
    messageColor: string;
    accentColor: string;
  };
}

export interface ChatMemoryMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  mode?: AIPersonalityMode;
}
