
// Define AIAssistantRole to match the database enum exactly
export type AIAssistantRole = "student" | "business_owner" | "general" | "employee" | "writer" | "professional" | "creator";

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// AI Settings interface
export interface AISettings {
  id?: string;
  assistant_name: string;
  tone: "professional" | "friendly" | "balanced" | "formal" | "casual";
  response_length: "concise" | "balanced" | "detailed";
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

// AI Knowledge Upload interface
export interface AIKnowledgeUpload {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Role contextualization information
export const RoleContexts: Record<AIAssistantRole, { 
  description: string;
  suggestions: string[];
  welcomeMessage: string;
  suggestedPrompts: string[];
  icon?: string;
}> = {
  student: {
    description: "Your AI study companion to help you learn, research, and excel in your education.",
    suggestions: [
      "Help me understand quantum physics for my exam tomorrow",
      "Can you explain photosynthesis in simple terms?",
      "Create a study plan for my final exams in 3 weeks",
      "I need to write a 1000-word essay about climate change",
      "What are good note-taking techniques for college lectures?"
    ],
    welcomeMessage: "Hello! I'm your student assistant. I can help with homework, research, studying, and academic questions. What would you like help with today?",
    suggestedPrompts: [
      "Help me understand this concept",
      "Create a study plan for me",
      "Explain this topic in simple terms",
      "Help me with my assignment"
    ]
  },
  professional: {
    description: "Your productivity assistant for work tasks, meetings, and professional development.",
    suggestions: [
      "Draft an email to my team about the project delay",
      "Summarize these meeting notes into key action items",
      "Help me prepare for my performance review next week",
      "What's the most effective way to structure my workday?",
      "How do I give constructive feedback to a colleague?"
    ],
    welcomeMessage: "Hello! I'm your work productivity assistant. I can help with emails, meetings, task management, and professional growth. How can I assist you today?",
    suggestedPrompts: [
      "Draft an email for me",
      "Help me prepare for a meeting",
      "Create a work schedule",
      "Give me feedback on this document"
    ]
  },
  creator: {
    description: "Your creative companion for content creation, design, and artistic development.",
    suggestions: [
      "Generate ideas for my next blog post about sustainable living",
      "Help me outline a podcast script about technology trends",
      "What are some color palettes that would work for a wellness brand?",
      "Give me feedback on this design concept I'm working on",
      "How can I grow my audience on social media?"
    ],
    welcomeMessage: "Hello! I'm your creative assistant. I can help with content creation, design ideas, creative blocks, and marketing your work. What creative project are you working on?",
    suggestedPrompts: [
      "Generate ideas for my content",
      "Help me outline a project",
      "Give me feedback on this draft",
      "Suggest improvements for my design"
    ]
  },
  business_owner: {
    description: "Your business advisor for strategy, operations, and growth opportunities.",
    suggestions: [
      "What's the best way to follow up with potential clients?",
      "Create a 30-day marketing plan for my new service",
      "Help me draft a job description for a marketing coordinator",
      "What metrics should I track for my online store?",
      "How can I improve customer retention for my business?"
    ],
    welcomeMessage: "Hello! I'm your business assistant. I can help with strategy, operations, customer relations, and growing your business. What business challenge can I help with today?",
    suggestedPrompts: [
      "Create a business plan",
      "Help me with marketing strategy",
      "Draft customer communication",
      "Optimize my operations"
    ]
  },
  general: {
    description: "Your all-purpose assistant for any questions, tasks, or information you need.",
    suggestions: [
      "What should I make for dinner with chicken and vegetables?",
      "I need gift ideas for my mom's birthday",
      "Help me plan a weekend trip to the mountains",
      "What are some good exercises I can do at home?",
      "Tell me about the history of jazz music"
    ],
    welcomeMessage: "Hi there! I'm your personal assistant. I can help with planning, information, creative ideas, and much more. What can I help you with today?",
    suggestedPrompts: [
      "Help me find information",
      "Give me ideas for this",
      "Help me plan something",
      "Explain this concept to me"
    ]
  },
  employee: {
    description: "Your workplace companion to help you excel in your role and career growth.",
    suggestions: [
      "How do I ask for a raise professionally?",
      "What skills should I develop for career advancement?",
      "Help me prepare for a job interview tomorrow",
      "Draft a resignation letter that's professional",
      "How can I better manage my work-life balance?"
    ],
    welcomeMessage: "Hello! I'm your workplace assistant. I can help with career development, workplace challenges, and professional skills. How can I support your work today?",
    suggestedPrompts: [
      "Help me with career development",
      "Draft professional communication",
      "Improve my workplace skills",
      "Balance work and personal life"
    ]
  },
  writer: {
    description: "Your writing assistant for creative projects, professional documents, and content creation.",
    suggestions: [
      "Help me brainstorm ideas for a short story",
      "Can you proofread this paragraph for errors?",
      "What's a good structure for a persuasive essay?",
      "Give me some creative writing prompts",
      "How can I make my writing more engaging?"
    ],
    welcomeMessage: "Hello! I'm your writing assistant. I can help with creative writing, editing, structure, and overcoming writer's block. What are you writing today?",
    suggestedPrompts: [
      "Help me brainstorm ideas",
      "Proofread this for me",
      "Suggest improvements for my writing",
      "Create an outline for my document"
    ]
  }
};
