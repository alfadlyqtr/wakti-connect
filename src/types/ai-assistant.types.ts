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
    commandSuggestions: [
      "Create a task for my math homework",
      "Schedule a study session for tomorrow at 4pm",
      "Help me organize my assignments by due date"
    ],
    suggestedPrompts: [
      "Create a study plan for my upcoming exams",
      "Help me summarize this chapter",
      "What's the best way to memorize formulas?",
      "Create a task for my essay due next week"
    ],
    quickTools: [
      { name: "Study Planner", description: "Create study schedules", icon: "Calendar" },
      { name: "Note Summarizer", description: "Summarize your notes", icon: "FileText" },
      { name: "Research Assistant", description: "Find academic sources", icon: "Search" },
      { name: "Concept Explainer", description: "Break down complex topics", icon: "BookOpen" }
    ]
  },
  "business_owner": {
    title: "Business Assistant",
    description: "Help with operations, staff, and business analytics",
    icon: "briefcase",
    welcomeMessage: "Hello! I'm your Business Assistant. I can help manage your tasks, staff, bookings, and provide business insights. What aspect of your business can I assist with today?",
    commandSuggestions: [
      "Show me my business analytics",
      "Create a task to follow up with clients",
      "View my staff status"
    ],
    suggestedPrompts: [
      "Generate a performance report for my business",
      "Create a task to review customer feedback",
      "Help me schedule staff for next week",
      "What's my business growth looking like?"
    ],
    quickTools: [
      { name: "Staff Scheduler", description: "Organize staff schedules", icon: "Users" },
      { name: "Business Analytics", description: "Review performance metrics", icon: "BarChart" },
      { name: "Customer Service", description: "Manage interactions", icon: "HeartHandshake" },
      { name: "Service Manager", description: "Business operations", icon: "Settings" }
    ]
  },
  "general": {
    title: "Productivity Assistant",
    description: "Help with tasks, scheduling, and general productivity",
    icon: "list-check",
    welcomeMessage: "Hello! I'm your Productivity Assistant. I can help manage your tasks, schedule events, and boost your productivity. How can I assist you today?",
    commandSuggestions: [
      "Create a task to buy groceries",
      "Show me my tasks for today",
      "Schedule a meeting with Sarah"
    ],
    suggestedPrompts: [
      "Help me organize my day",
      "Create a shopping list task",
      "Schedule a reminder for tomorrow",
      "How can I improve my productivity?"
    ],
    quickTools: [
      { name: "Day Planner", description: "Plan your schedule", icon: "Calendar" },
      { name: "Task Creator", description: "Create tasks & reminders", icon: "CheckSquare" },
      { name: "Quick Answer", description: "Get instant information", icon: "HelpCircle" },
      { name: "Idea Generator", description: "Creative solutions", icon: "Lightbulb" }
    ]
  },
  "employee": {
    title: "Work Assistant",
    description: "Help with workplace tasks and team coordination",
    icon: "users",
    welcomeMessage: "Hello! I'm your Work Assistant. I can help manage your work assignments, coordinate with your team, and track your job cards. How can I support your workday?",
    commandSuggestions: [
      "Show me my assigned tasks",
      "Create a task for the client project",
      "View my work schedule"
    ],
    suggestedPrompts: [
      "Track my hours for today",
      "Create a task for the team meeting notes",
      "Help me log my completed work",
      "What's on my agenda for today?"
    ],
    quickTools: [
      { name: "Email Composer", description: "Craft professional emails", icon: "FileText" },
      { name: "Content Creator", description: "Create written content", icon: "Edit" },
      { name: "Creative Writing", description: "Generate creative text", icon: "Mic" },
      { name: "Meeting Organizer", description: "Plan effective meetings", icon: "Users" }
    ]
  },
  "writer": {
    title: "Creative Assistant",
    description: "Help with content creation and creative projects",
    icon: "pen-nib",
    welcomeMessage: "Hello! I'm your Creative Assistant. I can help organize your writing projects, manage deadlines, and keep track of your creative tasks. What are you working on today?",
    commandSuggestions: [
      "Create a task for my article draft",
      "Schedule time for editing tomorrow",
      "Organize my writing deadlines"
    ],
    suggestedPrompts: [
      "Help me outline an article",
      "Create a writing schedule",
      "Give me feedback on this paragraph",
      "Create a task for my book chapter"
    ],
    quickTools: [
      { name: "Content Generator", description: "Generate writing ideas", icon: "Lightbulb" },
      { name: "Editor Helper", description: "Get editing assistance", icon: "Edit" },
      { name: "Writing Scheduler", description: "Plan writing sessions", icon: "Calendar" },
      { name: "Research Tool", description: "Find relevant information", icon: "Search" }
    ]
  }
};

// AI System Commands for task management and other WAKTI features
export interface SystemCommand {
  name: string;
  description: string;
  examples: string[];
  systemOnly?: boolean; // If true, only accessible to the system, not directly to users
}

export const SystemCommands: Record<string, SystemCommand> = {
  "create_task": {
    name: "Create Task",
    description: "Creates a new task in your task list",
    examples: [
      "Create a task to buy groceries",
      "Add a task for project research due tomorrow",
      "New task: call client at high priority"
    ]
  },
  "view_tasks": {
    name: "View Tasks",
    description: "Shows your current tasks",
    examples: [
      "Show my tasks",
      "View pending tasks",
      "List all my tasks"
    ]
  },
  "schedule_event": {
    name: "Schedule Event",
    description: "Creates a new event in your calendar",
    examples: [
      "Schedule a meeting tomorrow at 3pm",
      "Create an event for doctor appointment on Friday",
      "Add team meeting to calendar for next Monday"
    ]
  },
  "check_calendar": {
    name: "Check Calendar",
    description: "Shows your upcoming events",
    examples: [
      "Show my calendar",
      "What events do I have today?",
      "Check my schedule for next week"
    ]
  },
  "manage_staff": {
    name: "Manage Staff",
    description: "View and manage your staff (Business accounts only)",
    examples: [
      "Show my staff status",
      "View team members",
      "Check staff availability"
    ]
  },
  "view_analytics": {
    name: "View Analytics",
    description: "Shows business or productivity analytics",
    examples: [
      "Show my analytics",
      "View business performance",
      "Check my productivity stats"
    ]
  },
  "search_contacts": {
    name: "Search Contacts",
    description: "Finds contacts in your network",
    examples: [
      "Find contact John Smith",
      "Search for Sarah in my contacts",
      "Look up client contact info"
    ]
  },
  "view_bookings": {
    name: "View Bookings",
    description: "Shows your upcoming bookings or appointments",
    examples: [
      "Show my bookings",
      "View upcoming appointments",
      "Check my client bookings"
    ]
  },
  "get_task_insights": {
    name: "Get Task Insights",
    description: "Provides insights about your task management patterns",
    examples: [
      "How's my task management?",
      "Give me insights on my productivity",
      "Analyze my task completion"
    ],
    systemOnly: true
  },
  "get_business_overview": {
    name: "Get Business Overview",
    description: "Provides an overview of business performance",
    examples: [
      "Show business overview",
      "Give me a business summary",
      "How is my business doing?"
    ],
    systemOnly: true
  }
};

// AI productivity insights for task management
export interface AIProductivityInsight {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'positive';
  message: string;
}

// System voice assistant settings
export interface AIVoiceSettings {
  enabled: boolean;
  voiceId: string;
  speed: number;
  autoPlay: boolean;
}

// WAKTI AI Mode types
export type WAKTIAIMode = "general" | "productivity" | "student" | "creative";

// Mode configuration interface
export interface WAKTIAIModeConfig {
  id: WAKTIAIMode;
  title: string;
  description: string;
  icon: string;
  color: string;
  glowEffect: string;
  defaultPrompt: string;
}

// WAKTI AI Configuration
export const WAKTIAIModes: Record<WAKTIAIMode, WAKTIAIModeConfig> = {
  "general": {
    id: "general",
    title: "General Chat",
    description: "General help, questions, app walkthroughs, and guidance",
    icon: "message-circle",
    color: "bg-wakti-blue",
    glowEffect: "shadow-blue-500/20 border-blue-200/50",
    defaultPrompt: "How can I help you today?"
  },
  "productivity": {
    id: "productivity",
    title: "Productivity",
    description: "Manage tasks, reminders, and performance",
    icon: "list-check",
    color: "bg-purple-600",
    glowEffect: "shadow-purple-500/20 border-purple-200/50",
    defaultPrompt: "Let me help you organize your tasks and schedule."
  },
  "student": {
    id: "student",
    title: "Student",
    description: "Assist with homework and learning",
    icon: "graduation-cap",
    color: "bg-green-600",
    glowEffect: "shadow-green-500/20 border-green-200/50",
    defaultPrompt: "Ready to help with your studies and homework."
  },
  "creative": {
    id: "creative",
    title: "Creative",
    description: "Brainstorming, content creation, and visual ideas",
    icon: "sparkles",
    color: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
    glowEffect: "shadow-purple-500/20 border-purple-200/50",
    defaultPrompt: "Let's create something amazing together."
  }
};

// AI Tools configuration
export interface AITool {
  id: string;
  name: string;
  description: string;
  icon: string;
  component: string;
  availableModes: WAKTIAIMode[];
}

export const WAKTIAITools: AITool[] = [
  {
    id: "image-generation",
    name: "Image Generation",
    description: "Generate images from text descriptions",
    icon: "image",
    component: "ImageGenerationTool",
    availableModes: ["creative", "general"]
  },
  {
    id: "meeting-tool",
    name: "Meeting Tool",
    description: "Record and transcribe meetings with summaries",
    icon: "mic",
    component: "MeetingTool",
    availableModes: ["creative"]
  },
  {
    id: "task-creator",
    name: "Task Creator",
    description: "Create tasks from natural language",
    icon: "list-todo",
    component: "TaskCreatorTool",
    availableModes: ["productivity", "general"]
  },
  {
    id: "document-analyzer",
    name: "Document Analyzer",
    description: "Analyze uploaded documents",
    icon: "file-text",
    component: "DocumentAnalyzerTool",
    availableModes: ["student", "general", "productivity"]
  }
];

// Input method types
export type InputMethod = "text" | "voice" | "file" | "camera";

// Preview card interface
export interface AIPreviewCard {
  type: string;
  title: string;
  content: string;
  metadata?: Record<string, any>;
}
