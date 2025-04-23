
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export type AIAssistantRole = 'general' | 'student' | 'employee' | 'writer' | 'business_owner';

export interface RoleContext {
  title: string;
  description: string;
  welcomeMessage: string;
  suggestedPrompts: string[];
  color: string;
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
    color: "bg-blue-600"
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
    color: "bg-green-600"
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
    color: "bg-purple-600"
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
    color: "bg-pink-600"
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
    color: "bg-amber-600"
  }
};

export type WAKTIAIMode = 'general' | 'student' | 'productivity' | 'creative';
