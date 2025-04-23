export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export type AIAssistantRole = 'general' | 'student' | 'employee' | 'writer' | 'business_owner';

// Enhanced KnowledgeProfile interface with all required fields
export interface KnowledgeProfile {
  role: string;
  // Student-specific fields
  grade?: string;
  schoolType?: string;
  subjects?: string[];
  learningStyle?: string;
  studentGoals?: string[]; // Changed from goals to studentGoals for students
  // Business owner-specific fields
  industry?: string;
  businessType?: string;
  employeeCount?: string;
  targetAudience?: string;
  challenges?: string[];
  // Employee-specific fields
  field?: string;
  experienceLevel?: string;
  skills?: string[];
  currentProjects?: string[];
  workStyle?: string;
  // Writer-specific fields
  genre?: string;
  audience?: string;
  style?: string;
  // Shared goals field
  goals?: string[];
}

export interface RoleContext {
  title: string;
  description: string;
  welcomeMessage: string;
  suggestedPrompts: string[];
  color: string;
  commandSuggestions?: string[]; 
  quickTools?: Array<{ id: string; name: string; description: string; icon: string }>;
}

export const RoleContexts: Record<AIAssistantRole, RoleContext> = {
  general: {
    title: "AI Assistant",
    description: "General-purpose assistant to help with a variety of tasks",
    welcomeMessage: "Hello! How can I assist you today?",
    suggestedPrompts: [
      "Help me create a new task",
      "What are my upcoming deadlines?",
      "Summarize my tasks for this week",
      "How do I use the calendar feature?"
    ],
    color: "bg-blue-600",
    commandSuggestions: [
      "Create a task for tomorrow",
      "Show my appointments for this week",
      "Help me organize my day"
    ]
  },
  student: {
    title: "Student Assistant",
    description: "Helps with studying, homework, and academic planning",
    welcomeMessage: "Hi there! Need help with your studies?",
    suggestedPrompts: [
      "Create a study schedule for my upcoming exam",
      "Help me break down this assignment",
      "Explain this concept to me",
      "Create flashcards for these terms"
    ],
    color: "bg-green-600",
    commandSuggestions: [
      "Plan my study schedule",
      "Create notes on this topic",
      "Help me understand this assignment"
    ]
  },
  employee: {
    title: "Work Assistant",
    description: "Helps with work-related tasks and productivity",
    welcomeMessage: "Ready to boost your productivity?",
    suggestedPrompts: [
      "Organize my work tasks for today",
      "Draft an email to my team about the project update",
      "Prepare talking points for my meeting",
      "Help me prioritize my workload"
    ],
    color: "bg-purple-600",
    commandSuggestions: [
      "Schedule a new meeting",
      "Create a project timeline",
      "Prepare a work report"
    ]
  },
  writer: {
    title: "Creative Assistant",
    description: "Helps with creative writing and content creation",
    welcomeMessage: "Let's create something amazing together!",
    suggestedPrompts: [
      "Help me brainstorm ideas for my blog",
      "Write an outline for my article",
      "Give me feedback on this paragraph",
      "Suggest a catchy title for my post"
    ],
    color: "bg-pink-600",
    commandSuggestions: [
      "Generate content ideas",
      "Help me with writer's block",
      "Create an outline for my story"
    ]
  },
  business_owner: {
    title: "Business Assistant",
    description: "Helps with business planning and management",
    welcomeMessage: "How can I help your business grow today?",
    suggestedPrompts: [
      "Create a weekly action plan for my business",
      "Draft a customer follow-up message",
      "Help me organize my client meetings",
      "Prepare a simple marketing campaign outline"
    ],
    color: "bg-amber-600",
    commandSuggestions: [
      "Analyze business performance",
      "Plan a marketing strategy",
      "Manage customer relationships"
    ]
  }
};

// Adding missing interfaces that are needed for various components
export type WAKTIAIMode = 'general' | 'student' | 'productivity' | 'creative';

// AISettings interface for the AI settings components
export interface AISettings {
  id?: string;
  user_id: string;
  assistant_name: string;
  role: AIAssistantRole;
  tone: string;
  response_length: string;
  proactiveness: boolean;
  suggestion_frequency: string;
  enabled_features: Record<string, boolean>;
  knowledge_profile?: KnowledgeProfile;
}

// AIKnowledgeUpload interface for knowledge management
export interface AIKnowledgeUpload {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  role?: AIAssistantRole;
}

// Define AIMode interface for AIModeSwitcher
export interface AIMode {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

// Define WAKTIAIModes as an array of AIMode
export const WAKTIAIModes: AIMode[] = [
  {
    id: 'general',
    title: 'General',
    description: 'Ask me anything and get helpful responses',
    icon: 'bot',
    color: 'blue'
  },
  {
    id: 'student',
    title: 'Student',
    description: 'Help with studying, homework, and learning',
    icon: 'graduationCap',
    color: 'green'
  },
  {
    id: 'productivity',
    title: 'Productivity',
    description: 'Manage tasks, plan your day, and stay organized',
    icon: 'list',
    color: 'purple'
  },
  {
    id: 'creative',
    title: 'Creative',
    description: 'Generate ideas, content, and creative writing',
    icon: 'paintbrush',
    color: 'pink'
  }
];
