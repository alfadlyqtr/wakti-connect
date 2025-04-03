
// Define AIAssistantRole to match the database enum exactly
export type AIAssistantRole = "student" | "business_owner" | "general" | "employee" | "writer" | "professional" | "creator";

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Role contextualization information
export const RoleContexts: Record<AIAssistantRole, { 
  description: string;
  suggestions: string[];
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
    ]
  }
};
