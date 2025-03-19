
export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface AISettings {
  id?: number; // Added optional id field
  assistant_name: string;
  tone: "formal" | "casual" | "concise" | "detailed" | "balanced";
  response_length: "short" | "balanced" | "detailed";
  proactiveness: boolean;
  suggestion_frequency: "low" | "medium" | "high";
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
