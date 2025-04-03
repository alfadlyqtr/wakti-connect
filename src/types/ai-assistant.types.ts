
// AI Assistant role types
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
}

// Role contexts for AI assistant personalization
export const RoleContexts: Record<AIAssistantRole, {
  title: string;
  description: string;
  icon: string;
  welcomeMessage?: string;
  commandSuggestions?: string[];
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
