
import { ReactNode } from 'react';

export type WAKTIAIMode = 'general' | 'student' | 'productivity' | 'creative' | 'employee' | 'writer' | 'business_owner';
export type AIAssistantRole = WAKTIAIMode;

export interface AIPersonality {
  id: string;
  name: string;
  systemPrompt: string;
  icon: string;
  color: string;
  title?: string;
  description?: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  mode?: WAKTIAIMode;
}

export interface AISettings {
  id?: string;
  name: string;
  assistant_name?: string;
  role?: AIAssistantRole;
  tone: 'professional' | 'friendly' | 'balanced' | 'formal' | 'casual';
  response_length: 'concise' | 'balanced' | 'detailed';
  proactiveness: boolean;
  suggestion_frequency: 'low' | 'medium' | 'high';
  enabled_features: {
    voice_input: boolean;
    voice_output: boolean;
    task_detection: boolean;
    meeting_scheduling: boolean;
    personalized_suggestions: boolean;
    tasks?: boolean;
    events?: boolean;
    staff?: boolean;
    analytics?: boolean;
    messaging?: boolean;
  };
}

export interface AIKnowledgeUpload {
  id: string;
  name: string;
  title?: string;
  role?: AIAssistantRole;
  type: string;
  size: number;
  upload_date: Date;
  created_at?: string;
  updated_at?: string;
  status: 'processing' | 'ready' | 'error';
  description?: string;
  content?: string;
  user_id?: string;
}

// Define role contexts for the assistant to use in different modes
export const RoleContexts = {
  general: {
    title: 'AI Assistant',
    description: 'Helping with general questions and tasks',
    welcomeMessage: 'Hello! How can I assist you with your business today?',
    icon: 'bot',
    suggestedPrompts: ['How can I use WAKTI?', 'What features are available?', 'Help me get started'],
    commandSuggestions: ['Create a task', 'Schedule a meeting', 'Set a reminder'],
    quickTools: [
      { name: 'Voice Assistant', icon: 'Mic', description: 'Use voice commands to interact' },
      { name: 'Task Creator', icon: 'CheckSquare', description: 'Create and manage tasks' },
      { name: 'Quick Answer', icon: 'HelpCircle', description: 'Get quick answers to questions' }
    ]
  },
  student: {
    title: 'Learning Assistant',
    description: 'Helping with learning and education',
    welcomeMessage: 'Hello! What would you like to learn about today?',
    icon: 'graduation-cap',
    suggestedPrompts: ['Explain this concept', 'Help with homework', 'Create a study plan'],
    commandSuggestions: ['Summarize this text', 'Quiz me on this topic', 'Find learning resources'],
    quickTools: [
      { name: 'Study Planner', icon: 'Calendar', description: 'Plan your study sessions' },
      { name: 'Note Summarizer', icon: 'FileText', description: 'Summarize your notes' },
      { name: 'Research Assistant', icon: 'Search', description: 'Find relevant resources' }
    ]
  },
  productivity: {
    title: 'Productivity Assistant',
    description: 'Helping with tasks and productivity',
    welcomeMessage: 'Hello! I can help you manage tasks and improve productivity. What would you like to focus on?',
    icon: 'list-check',
    suggestedPrompts: ['How can I be more productive?', 'Help me organize my day', 'Create a project timeline'],
    commandSuggestions: ['Add a task', 'Create a schedule', 'Set priorities'],
    quickTools: [
      { name: 'Day Planner', icon: 'Calendar', description: 'Plan your day efficiently' },
      { name: 'Task Creator', icon: 'CheckSquare', description: 'Create and manage tasks' },
      { name: 'Idea Generator', icon: 'Lightbulb', description: 'Generate new ideas' }
    ]
  },
  creative: {
    title: 'Creative Assistant',
    description: 'Helping with creative projects',
    welcomeMessage: 'Hello! Let\'s unleash your creativity today. What would you like to create?',
    icon: 'sparkles',
    suggestedPrompts: ['Help me brainstorm ideas', 'Write creative content', 'Design suggestions'],
    commandSuggestions: ['Generate a story', 'Create marketing copy', 'Design concepts'],
    quickTools: [
      { name: 'Content Creator', icon: 'Edit', description: 'Create engaging content' },
      { name: 'Idea Generator', icon: 'Lightbulb', description: 'Generate creative ideas' },
      { name: 'Image Inspiration', icon: 'Image', description: 'Get visual inspiration' }
    ]
  },
  employee: {
    title: 'Work Assistant',
    description: 'Helping with workplace tasks and communication',
    welcomeMessage: 'Hello! I can help with your work tasks and professional communication. What do you need today?',
    icon: 'briefcase',
    suggestedPrompts: ['Draft an email to my team', 'Help with a presentation', 'Professional writing tips'],
    commandSuggestions: ['Create meeting minutes', 'Draft a project proposal', 'Write professional email'],
    quickTools: [
      { name: 'Email Composer', icon: 'Edit', description: 'Draft professional emails' },
      { name: 'Meeting Organizer', icon: 'Calendar', description: 'Plan and organize meetings' },
      { name: 'Task Manager', icon: 'CheckSquare', description: 'Manage your work tasks' }
    ]
  },
  writer: {
    title: 'Writer Assistant',
    description: 'Helping with writing and content creation',
    welcomeMessage: 'Hello! Ready to write something amazing today? How can I assist with your writing?',
    icon: 'pen',
    suggestedPrompts: ['Help me write an article', 'Proofread my text', 'Improve my paragraph'],
    commandSuggestions: ['Generate blog ideas', 'Create content outline', 'Edit my writing'],
    quickTools: [
      { name: 'Content Generator', icon: 'Edit', description: 'Generate writing content' },
      { name: 'Editor Helper', icon: 'FileText', description: 'Edit and improve your writing' },
      { name: 'Research Tool', icon: 'Search', description: 'Find writing resources' }
    ]
  },
  business_owner: {
    title: 'Business Assistant',
    description: 'Helping with business operations and strategy',
    welcomeMessage: 'Hello! I can assist with your business operations and strategy. How can I help you today?',
    icon: 'building',
    suggestedPrompts: ['Help with business planning', 'Marketing strategy ideas', 'Customer engagement tips'],
    commandSuggestions: ['Create business report', 'Draft business proposal', 'Analyze customer data'],
    quickTools: [
      { name: 'Staff Scheduler', icon: 'Users', description: 'Manage staff schedules' },
      { name: 'Business Analytics', icon: 'BarChart', description: 'Analyze business data' },
      { name: 'Customer Service', icon: 'HeartHandshake', description: 'Improve customer relations' }
    ]
  }
};

// Define WAKTIAIModes with colors and default prompts for UI representation
export const WAKTIAIModes = {
  general: {
    id: 'general',
    color: 'bg-blue-600',
    defaultPrompt: 'I can help you with general questions, business tasks, and more. How can I assist you today?',
    title: 'General Assistant',
    description: 'Help with various tasks and questions'
  },
  student: {
    id: 'student',
    color: 'bg-green-600',
    defaultPrompt: 'I can help with learning, explaining concepts, study planning, and educational resources. What would you like to learn?',
    title: 'Learning Assistant',
    description: 'Support for students and learning'
  },
  productivity: {
    id: 'productivity',
    color: 'bg-purple-600',
    defaultPrompt: 'I can help you organize tasks, plan your schedule, and improve productivity. What would you like to focus on?',
    title: 'Productivity Assistant',
    description: 'Boost your productivity and organization'
  },
  creative: {
    id: 'creative',
    color: 'bg-pink-600',
    defaultPrompt: 'Let\'s explore creative ideas, content creation, or brainstorming. What would you like to create today?',
    title: 'Creative Assistant',
    description: 'Unleash your creativity'
  },
  employee: {
    id: 'employee',
    color: 'bg-indigo-600',
    defaultPrompt: 'I can help with workplace communication, reports, and professional tasks. What do you need assistance with?',
    title: 'Work Assistant',
    description: 'Support for workplace tasks'
  },
  writer: {
    id: 'writer',
    color: 'bg-emerald-600',
    defaultPrompt: 'Let me help you with writing, editing, and content creation. What would you like to write today?',
    title: 'Writer Assistant',
    description: 'Assistance for writers and content creators'
  },
  business_owner: {
    id: 'business_owner',
    color: 'bg-amber-600',
    defaultPrompt: 'I can help with business operations, strategy, and management. How can I assist your business today?',
    title: 'Business Assistant',
    description: 'Support for business owners and managers'
  }
};
