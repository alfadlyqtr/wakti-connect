
export type WAKTIAIMode = 'general' | 'student' | 'productivity' | 'employee' | 'writer' | 'business_owner';

export interface AIPersonality {
  id: string;
  name: string;
  title: string;
  description: string;
  systemPrompt: string;
  welcomeMessage: string; // Adding this property that was missing
  suggestedPrompts: string[];
  color: string;
  gradient: string;
  bgGradient: string;
  iconColor: string;
  mode: WAKTIAIMode;
  lightTheme: {
    bgColor: string;
    textColor: string;
    buttonColor: string;
    accentColor: string;
  };
  darkTheme: {
    bgColor: string;
    textColor: string;
    buttonColor: string;
    accentColor: string;
  };
  getInputGlowClass?: (isDarkMode: boolean) => string;
  quickTools?: {
    name: string;
    description: string;
    icon: string;
  }[];
}

export interface AISettings {
  user_id: string;
  assistant_name: string;
  role: WAKTIAIMode;
  tone: string;
  response_length: string;
  proactiveness: boolean;
  suggestion_frequency: string;
  enabled_features: {
    voice_input: boolean;
    voice_output: boolean;
    task_detection: boolean;
    meeting_scheduling: boolean;
    personalized_suggestions: boolean;
    tasks?: boolean;
    events?: boolean;
    staff?: boolean;
    analytics?: boolean;
    messaging?: boolean;
  };
}

export interface AIKnowledgeUpload {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  name: string;
  type: string;
  size: number;
  upload_date: string;
  status: 'processing' | 'complete' | 'error';
  role?: string;
}
