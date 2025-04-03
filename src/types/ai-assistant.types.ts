export type AIAssistantRole = "student" | "professional" | "creator" | "business_owner" | "general" | "employee" | "writer";

export interface AIMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

export interface AIAssistantSettings {
  id?: string;
  user_id: string;
  assistant_name?: string;
  role?: AIAssistantRole;
  tone?: string;
  response_length?: string;
  suggestion_frequency?: string;
  proactiveness?: boolean;
  enabled_features?: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
}

// For backwards compatibility with other files
export type AISettings = AIAssistantSettings;

export interface AIKnowledgeUpload {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  file_path?: string;
  content?: string;
  created_at: string;
  updated_at?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_type?: string;
  file_size?: number;
}

// Role-specific contexts for the AI
export const RoleContexts = {
  student: {
    title: "Study Assistant",
    description: "I can help with study plans, research, and educational tasks.",
    color: "from-blue-600 to-blue-500",
    suggestions: [
      "Create a study schedule for my final exams",
      "Help me understand this concept",
      "Summarize this research paper"
    ],
    suggestedPrompts: [
      "Create a study schedule for my final exams",
      "Help me understand this concept",
      "Summarize this research paper",
      "Create flashcards for me on this topic"
    ],
    welcomeMessage: "Good day! I'm your Study Assistant. I can help with study plans, research, educational tasks, and more. What would you like help with today?"
  },
  professional: {
    title: "Work Assistant",
    description: "I can help with professional tasks, productivity, and work planning.",
    color: "from-purple-600 to-purple-500",
    suggestions: [
      "Schedule a team meeting for next week",
      "Help me prioritize my tasks for today",
      "Draft an email to a client"
    ],
    suggestedPrompts: [
      "Schedule a team meeting for next week",
      "Help me prioritize my tasks for today",
      "Draft an email to a client",
      "Create a presentation outline"
    ],
    welcomeMessage: "Hello! I'm your Work Assistant. I can help with professional tasks, productivity, work planning, and more. How can I assist you today?"
  },
  creator: {
    title: "Creator Assistant",
    description: "I can help with creative projects, content, and marketing.",
    color: "from-green-600 to-green-500",
    suggestions: [
      "Generate content ideas for my social media",
      "Help me outline a blog post",
      "Create a content calendar"
    ],
    suggestedPrompts: [
      "Generate content ideas for my social media",
      "Help me outline a blog post",
      "Create a content calendar",
      "Draft a creative brief for this project"
    ],
    welcomeMessage: "Hi there! I'm your Creator Assistant. I can help with creative projects, content creation, marketing, and more. What creative challenge can I help with today?"
  },
  business_owner: {
    title: "Business Assistant",
    description: "I can help with business operations, customer service, and planning.",
    color: "from-amber-600 to-amber-500",
    suggestions: [
      "Analyze my customer feedback",
      "Create a business plan for my new venture",
      "Schedule my staff for next week"
    ],
    suggestedPrompts: [
      "Analyze my customer feedback",
      "Create a business plan for my new venture",
      "Schedule my staff for next week",
      "Draft a customer response template"
    ],
    welcomeMessage: "Welcome! I'm your Business Assistant. I can help with business operations, customer service, planning, and more. How can I support your business today?"
  },
  general: {
    title: "AI Assistant",
    description: "I can help with a variety of tasks and answer questions.",
    color: "from-wakti-blue to-wakti-blue/90",
    suggestions: [
      "What's on my schedule today?",
      "Create a to-do list for me",
      "Help me plan my day"
    ],
    suggestedPrompts: [
      "What's on my schedule today?",
      "Create a to-do list for me",
      "Help me plan my day",
      "Find information about this topic"
    ],
    welcomeMessage: "Hi! I'm your WAKTI AI Assistant. I can help with a variety of tasks and answer questions across many domains. What can I do for you today?"
  },
  employee: {
    title: "Employee Assistant",
    description: "I can help with daily work tasks and organization.",
    color: "from-cyan-600 to-cyan-500",
    suggestions: [
      "Track my working hours",
      "Report my daily tasks to my manager",
      "Schedule a meeting with the team"
    ],
    suggestedPrompts: [
      "Track my working hours",
      "Report my daily tasks to my manager",
      "Schedule a meeting with the team",
      "Create a work log for today"
    ],
    welcomeMessage: "Hello! I'm your Employee Assistant. I can help with daily work tasks, organization, reporting, and more. How can I assist you with your work today?"
  },
  writer: {
    title: "Writing Assistant",
    description: "I can help with writing, editing, and content creation.",
    color: "from-indigo-600 to-indigo-500",
    suggestions: [
      "Help me write a professional email",
      "Edit this paragraph for clarity",
      "Generate an article outline"
    ],
    suggestedPrompts: [
      "Help me write a professional email",
      "Edit this paragraph for clarity",
      "Generate an article outline",
      "Suggest a better way to phrase this"
    ],
    welcomeMessage: "Greetings! I'm your Writing Assistant. I can help with writing, editing, content creation, and more. What would you like to write or edit today?"
  }
};
