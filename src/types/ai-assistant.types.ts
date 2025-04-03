
export type AIAssistantRole = "student" | "professional" | "creator" | "business_owner" | "general";

export interface AIMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

export interface AIAssistantSettings {
  id?: string;
  user_id: string;
  assistant_name?: string;
  role?: AIAssistantRole;
  tone?: string;
  response_length?: string;
  suggestion_frequency?: string;
  proactiveness?: boolean;
  enabled_features?: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
}
