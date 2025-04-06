
// AI Assistant role types - must match what's in the database
export type AIAssistantRole = "student" | "business_owner" | "general" | "employee" | "writer";

// AI settings interface
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
  knowledge_profile?: any; // This is used client-side only, not stored in DB
}

// AI message interface
export interface AIMessage {
  id: string;
  role: "user" | "assistant" | "system" | "error";
  content: string;
  timestamp: Date;
}

// AI knowledge upload interface
export interface AIKnowledgeUpload {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  role?: AIAssistantRole; // Added role property for role-specific knowledge
}

// Role contexts for AI assistant personalization
export const RoleContexts: Record<AIAssistantRole, {
  title: string;
  description: string;
  icon: string;
  welcomeMessage?: string;
  commandSuggestions?: string[];
  suggestedPrompts?: string[];
  quickTools?: Array<{name: string; description: string; icon: string;}>;
}> = {
  "student": {
    title: "Study Assistant",
    description: "Help with learning, assignments, and study planning",
    icon: "graduation-cap",
    welcomeMessage: "Hello! I'm your Study Assistant. I can help with homework, study planning, and educational questions. How can I assist with your learning today?",
    suggestedPrompts: [
      "Create a study plan for my final exams",
      "Help me understand this math concept",
      "Summarize this article for my research",
      "How do I improve my study habits?"
    ],
    quickTools: [
      { name: "Study Planner", description: "Create a customized study schedule", icon: "Calendar" },
      { name: "Note Summarizer", description: "Summarize your notes or texts", icon: "FileText" },
      { name: "Research Assistant", description: "Help finding reliable sources", icon: "Search" },
      { name: "Concept Explainer", description: "Explain complex topics simply", icon: "BookOpen" }
    ]
  },
  "business_owner": {
    title: "Business Assistant",
    description: "Support for managing your business and staff",
    icon: "briefcase",
    welcomeMessage: "Hello! I'm your Business Assistant. I can help with staff management, service bookings, and business analytics. How can I support your business today?",
    suggestedPrompts: [
      "Create a task for my marketing team",
      "Help me draft a professional email",
      "Analyze my recent business performance",
      "Schedule a team meeting for next week"
    ],
    quickTools: [
      { name: "Staff Scheduler", description: "Manage employee schedules", icon: "Calendar" },
      { name: "Business Analytics", description: "Insights into business performance", icon: "BarChart" },
      { name: "Customer Service", description: "Improve client communication", icon: "HeartHandshake" },
      { name: "Service Manager", description: "Organize business services", icon: "Settings" }
    ]
  },
  "general": {
    title: "Personal Assistant",
    description: "General productivity and task management",
    icon: "user",
    welcomeMessage: "Hello! I'm your Personal Assistant. I can help organize tasks, plan events, and boost your productivity. What would you like help with today?",
    suggestedPrompts: [
      "Create a to-do list for today",
      "Remind me to call mom at 5pm",
      "How can I be more productive?",
      "Help me plan my weekend"
    ],
    quickTools: [
      { name: "Day Planner", description: "Organize your daily schedule", icon: "Calendar" },
      { name: "Task Creator", description: "Create and track tasks", icon: "CheckSquare" },
      { name: "Quick Answer", description: "Get information fast", icon: "HelpCircle" },
      { name: "Idea Generator", description: "Brainstorm creative ideas", icon: "Lightbulb" }
    ]
  },
  "employee": {
    title: "Work Assistant",
    description: "Support for professional tasks and team coordination",
    icon: "briefcase",
    welcomeMessage: "Hello! I'm your Work Assistant. I can help manage projects, coordinate with your team, and track work tasks. How can I assist with your work today?",
    suggestedPrompts: [
      "Create a task for my current project",
      "Draft an email to my team about the meeting",
      "Help me prepare for tomorrow's presentation",
      "Set a reminder for the weekly report"
    ],
    quickTools: [
      { name: "Email Composer", description: "Draft professional emails", icon: "Edit" },
      { name: "Content Creator", description: "Help with work documents", icon: "FileText" },
      { name: "Creative Writing", description: "Generate creative content", icon: "Edit" },
      { name: "Meeting Organizer", description: "Plan effective meetings", icon: "Users" }
    ]
  },
  "writer": {
    title: "Creative Assistant",
    description: "Support for writing and creative projects",
    icon: "pen",
    welcomeMessage: "Hello! I'm your Creative Assistant. I can help with writing projects, creative ideas, and managing your content calendar. How can I inspire your creativity today?",
    suggestedPrompts: [
      "Help me brainstorm article ideas",
      "Create an outline for my blog post",
      "Review this draft and suggest improvements",
      "Help me develop this character for my story"
    ],
    quickTools: [
      { name: "Content Generator", description: "Generate creative content", icon: "Edit" },
      { name: "Editor Helper", description: "Review and improve writing", icon: "FileText" },
      { name: "Writing Scheduler", description: "Plan your content calendar", icon: "Calendar" },
      { name: "Research Tool", description: "Find information for your writing", icon: "Search" }
    ]
  }
};

