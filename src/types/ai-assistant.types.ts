
// This file defines the types for the AI assistant feature

export type AIAssistantRole = "student" | "professional" | "creator" | "business_owner" | "general" | "employee" | "writer";

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

// Define quick tool type
interface QuickTool {
  name: string;
  description: string;
  icon: string;
}

// Define role context type
interface RoleContext {
  title: string;
  description: string;
  welcomeMessage?: string;
  suggestions?: string[];
  suggestedPrompts?: string[];
  quickTools?: QuickTool[];
}

// Define the role contexts for different assistant roles
export const RoleContexts: Record<AIAssistantRole, RoleContext> = {
  student: {
    title: "Study Assistant",
    description: "I'm here to help with your studies, homework, and academic research.",
    welcomeMessage: "Hello! I'm your Study Assistant. I can help with homework, study plans, research, and more.",
    suggestedPrompts: [
      "Create a study plan for my upcoming exam",
      "Help me understand this topic...",
      "Summarize these notes for me",
      "Create a quiz about this subject"
    ],
    quickTools: [
      { name: "Homework Helper", description: "Get help with assignments", icon: "BookOpen" },
      { name: "Study Planner", description: "Create study schedules", icon: "Calendar" },
      { name: "Note Summarizer", description: "Condense your notes", icon: "FileText" },
      { name: "Research Assistant", description: "Find sources & info", icon: "Search" }
    ]
  },
  professional: {
    title: "Work Assistant",
    description: "I'm here to boost your productivity and help with professional tasks.",
    welcomeMessage: "Hi there! I'm your Work Assistant. I can help with emails, scheduling, task management, and more.",
    suggestedPrompts: [
      "Draft an email to my team about...",
      "Help me prioritize these tasks",
      "Create a meeting agenda for tomorrow",
      "Proofread this document for me"
    ],
    quickTools: [
      { name: "Email Composer", description: "Create professional emails", icon: "Mail" },
      { name: "Meeting Scheduler", description: "Plan your meetings", icon: "CalendarRange" },
      { name: "Task Prioritizer", description: "Organize your workload", icon: "ListChecks" },
      { name: "Document Creator", description: "Generate documents", icon: "FileEdit" }
    ]
  },
  creator: {
    title: "Creative Assistant",
    description: "I'm here to spark ideas and help with your creative projects.",
    welcomeMessage: "Welcome! I'm your Creative Assistant. I can help with content ideas, design suggestions, and creative workflows.",
    suggestedPrompts: [
      "Generate content ideas for my social media",
      "Help me outline a blog post about...",
      "Suggest a color palette for my design",
      "Create a content calendar for next month"
    ],
    quickTools: [
      { name: "Content Generator", description: "Get fresh ideas", icon: "Sparkles" },
      { name: "Content Calendar", description: "Plan your content", icon: "Calendar" },
      { name: "Caption Writer", description: "Craft engaging captions", icon: "Quote" },
      { name: "Hashtag Generator", description: "Find relevant hashtags", icon: "Hash" }
    ]
  },
  business_owner: {
    title: "Business Assistant",
    description: "I'm here to help you manage and grow your business effectively.",
    welcomeMessage: "Hi there! I'm your Business Assistant. I can help with staff management, customer service, analytics, and more.",
    suggestedPrompts: [
      "Create a staff schedule for next week",
      "Draft a response to this customer complaint",
      "Analyze these sales numbers for me",
      "Suggest ways to improve my service offering"
    ],
    quickTools: [
      { name: "Staff Scheduler", description: "Manage your team", icon: "Users" },
      { name: "Customer Service", description: "Improve client relations", icon: "HeartHandshake" },
      { name: "Business Analytics", description: "Understand your data", icon: "BarChart" },
      { name: "Service Manager", description: "Optimize your offerings", icon: "Settings" }
    ]
  },
  general: {
    title: "Personal Assistant",
    description: "I'm here to help with a variety of tasks and questions throughout your day.",
    welcomeMessage: "Hello! I'm your Personal Assistant. How can I help you today?",
    suggestedPrompts: [
      "Help me plan my day",
      "Create a to-do list for me",
      "I need a quick answer about...",
      "Help me organize this event"
    ],
    quickTools: [
      { name: "Day Planner", description: "Organize your schedule", icon: "CalendarCheck" },
      { name: "Task Creator", description: "Create to-do lists", icon: "ListTodo" },
      { name: "Event Organizer", description: "Plan gatherings", icon: "PartyPopper" },
      { name: "Quick Answer", description: "Get fast information", icon: "Search" }
    ]
  },
  employee: {
    title: "Work Assistant",
    description: "I'm here to help you with your work tasks and responsibilities.",
    welcomeMessage: "Hi there! I'm your Work Assistant. I can help you manage tasks, track your time, and stay organized.",
    suggestedPrompts: [
      "Help me track my hours for today",
      "Create a report for the tasks I completed",
      "Draft a message to my supervisor about...",
      "Organize my work schedule for this week"
    ],
    quickTools: [
      { name: "Time Tracker", description: "Log your hours", icon: "Clock" },
      { name: "Task Reporter", description: "Document your work", icon: "ClipboardCheck" },
      { name: "Meeting Organizer", description: "Plan work meetings", icon: "Users" },
      { name: "Work Log", description: "Track daily activities", icon: "FileText" }
    ]
  },
  writer: {
    title: "Writing Assistant",
    description: "I'm here to help with all your writing needs and creative text projects.",
    welcomeMessage: "Hello! I'm your Writing Assistant. I can help with drafting, editing, and improving your written content.",
    suggestedPrompts: [
      "Help me draft an email about...",
      "Edit this paragraph for clarity",
      "Create an outline for my blog post",
      "Check the grammar in this text"
    ],
    quickTools: [
      { name: "Email Writer", description: "Craft effective emails", icon: "Mail" },
      { name: "Text Editor", description: "Polish your writing", icon: "FileEdit" },
      { name: "Outline Generator", description: "Structure your content", icon: "List" },
      { name: "Grammar Checker", description: "Fix language errors", icon: "Check" }
    ]
  }
};
