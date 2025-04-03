
export type AIAssistantRole = 'student' | 'professional' | 'creator' | 'business_owner' | 'general';

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

export interface RoleContext {
  welcomeMessage: string;
  description: string;
  suggestedPrompts: string[];
  toolsAvailable: string[];
}

export const RoleContexts: Record<AIAssistantRole, RoleContext> = {
  student: {
    welcomeMessage: "Hi there! I'm your academic assistant. What are you studying today?",
    description: "I can help with homework, research papers, study plans, and learning new subjects. Upload study materials for analysis or ask about any academic topic.",
    suggestedPrompts: [
      "Help me create a study plan for my final exams",
      "Explain this math concept: [your topic]",
      "I need help with my essay on [topic]",
      "Help me prepare for my presentation on [subject]",
      "Can you quiz me on [subject]?",
      "Create flashcards for me about [topic]"
    ],
    toolsAvailable: ["Document Analysis", "Subject Explorer", "Study Planner", "Citation Helper"]
  },
  professional: {
    welcomeMessage: "Welcome! I'm your workplace productivity assistant. How can I help you be more effective today?",
    description: "I can help with work emails, presentations, meeting notes, task management, and workplace productivity. Upload documents for analysis or ask about any work-related topic.",
    suggestedPrompts: [
      "Draft an email to my team about the project update",
      "Help me prepare talking points for my meeting",
      "I need to organize my tasks by priority",
      "Draft a professional response to this client feedback",
      "Create a weekly work plan for me",
      "Generate a summary of these meeting notes"
    ],
    toolsAvailable: ["Email Assistant", "Meeting Planner", "Task Organizer", "Document Analysis"]
  },
  creator: {
    welcomeMessage: "Welcome, creative mind! What are we creating today?",
    description: "I can help with writing, content creation, brainstorming ideas, and creative projects. Share your creative work for feedback or ask for inspiration on any topic.",
    suggestedPrompts: [
      "Help me brainstorm ideas for my blog post about [topic]",
      "I need help outlining my story about [concept]",
      "Write a catchy headline for my article about [topic]",
      "Help me edit this paragraph for clarity",
      "Create a content calendar for my social media",
      "Give me feedback on this creative piece"
    ],
    toolsAvailable: ["Content Generator", "Editor's Assistant", "Idea Generator", "Social Media Helper"]
  },
  business_owner: {
    welcomeMessage: "Welcome! I'm your business management assistant. How can I help your business succeed today?",
    description: "I can help with operations, customer service, marketing, staff management, and business analytics. Upload business documents for analysis or ask about any business topic.",
    suggestedPrompts: [
      "Create a response template for customer inquiries",
      "Help me draft a job description for a new position",
      "I need to plan my marketing strategy for Q3",
      "Create a template for our weekly business review",
      "Draft a business update email for my team",
      "Help me optimize my service pricing structure"
    ],
    toolsAvailable: ["Customer Service Helper", "Staff Manager", "Analytics Dashboard", "Marketing Assistant"]
  },
  general: {
    welcomeMessage: "Hello! I'm your WAKTI AI assistant. How can I help you today?",
    description: "I can help with a variety of tasks, from scheduling to organization to information gathering. Upload documents for analysis or ask me about any topic you need help with.",
    suggestedPrompts: [
      "Help me plan my day",
      "Create a shopping list for me",
      "I need to organize my digital files",
      "Draft a personal email to a friend",
      "Help me find information about [topic]",
      "Create a checklist for my upcoming trip"
    ],
    toolsAvailable: ["Task Manager", "Schedule Helper", "Information Finder", "Personal Assistant"]
  }
};

export interface AIAssistantProfile {
  student?: {
    educationLevel?: string;
    institution?: string;
    major?: string;
    year?: string;
    subjects?: string[];
  };
  professional?: {
    industry?: string;
    role?: string;
    skills?: string[];
    tools?: string[];
  };
  creator?: {
    creativeFields?: string[];
    platforms?: string[];
    audience?: string;
    style?: string;
  };
  business?: {
    industry?: string;
    companySize?: string;
    services?: string[];
    goals?: string[];
  };
}
