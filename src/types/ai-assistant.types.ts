
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
  enabled_features: {
    tasks: boolean;
    events: boolean;
    staff: boolean;
    analytics: boolean;
    messaging: boolean;
    text_generation: boolean; // Required field for email signatures, templates
    _userRole?: string;
    _assistantMode?: string;
    _specializedSettings?: Record<string, any>;
    [key: string]: any; // Allow for additional custom properties
  };
  // Add new fields for enhanced AI personalization
  user_role?: "student" | "professional" | "business_owner" | "other";
  assistant_mode?: "tutor" | "content_creator" | "project_manager" | "business_manager" | "personal_assistant" | "text_generator";
  specialized_settings?: Record<string, any>;
}

export interface AIKnowledgeUpload {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
}
