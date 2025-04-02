
export type AIAssistantRole = 'student' | 'employee' | 'writer' | 'business_owner' | 'general';

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface AISettings {
  id?: string;
  assistant_name: string;
  tone: "formal" | "casual" | "concise" | "detailed" | "balanced";
  response_length: "short" | "balanced" | "detailed";
  proactiveness: boolean;
  suggestion_frequency: "low" | "medium" | "high";
  role: AIAssistantRole;
  enabled_features: {
    tasks: boolean;
    events: boolean;
    staff: boolean;
    analytics: boolean;
    messaging: boolean;
  };
}

export interface AIKnowledgeUpload {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

export interface AIProcessedDocument {
  id: string;
  user_id: string;
  document_name: string;
  document_type: string;
  content: string;
  summary?: string;
  extracted_entities?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
