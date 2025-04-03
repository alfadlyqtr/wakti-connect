
// This file defines the types for the AI assistant feature

export type AIAssistantRole = "student" | "professional" | "creator" | "business_owner" | "general";

export interface AISettings {
  id?: string;
  user_id?: string;
  assistant_name: string;
  role: AIAssistantRole;
  tone: string;
  response_length: string;
  proactiveness: boolean;
  suggestion_frequency: string;
  enabled_features: Record<string, boolean>;
  knowledge_profile?: Record<string, any>; // Add knowledge profile field
  created_at?: string;
  updated_at?: string;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isSystem?: boolean;
  isError?: boolean;
}

export interface AIKnowledgeUpload {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
}
