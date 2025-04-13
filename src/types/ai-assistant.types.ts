
import { ReactNode } from "react";

export type AIAssistantRole = 'general' | 'student' | 'employee' | 'business_owner' | 'writer';

export interface AIMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface KnowledgeProfile {
  role?: AIAssistantRole;
  // Student profile fields
  grade?: string;
  schoolType?: string;
  subjects?: string;
  learningStyle?: string;
  goals?: string;
  // Business profile fields
  industry?: string;
  businessType?: string;
  employeeCount?: string;
  targetAudience?: string;
  challenges?: string;
  // Employee profile fields
  field?: string;
  experienceLevel?: string;
  skills?: string;
  currentProjects?: string;
  workStyle?: string;
  // Writer profile fields
  genre?: string;
  audience?: string;
  style?: string;
}

export interface AISettings {
  id?: string;
  user_id?: string;
  role: AIAssistantRole;
  language: string;
  voiceEnabled: boolean;
  memoryEnabled: boolean;
  includePersonalContext: boolean;
  
  // Added properties
  assistant_name?: string;
  tone?: 'professional' | 'friendly' | 'balanced' | 'formal' | 'casual';
  response_length?: 'concise' | 'balanced' | 'detailed';
  proactiveness?: boolean;
  suggestion_frequency?: 'low' | 'medium' | 'high';
  enabled_features?: {
    tasks: boolean;
    events: boolean;
    staff: boolean;
    analytics: boolean;
    messaging: boolean;
  };
  knowledge_profile?: KnowledgeProfile;
}

export interface AIKnowledgeUpload {
  id: string;
  name: string;
  type: string;
  size: number;
  timestamp: Date;
  status: 'processing' | 'ready' | 'error';
  
  // Added properties
  title?: string;
  role?: AIAssistantRole;
  created_at?: string | Date;
}

export interface RoleContextTool {
  name: string;
  icon: string;
  description: string;
}

export interface RoleContext {
  title: string;
  description: string;
  systemPrompt: string;
  suggestedPrompts: string[];
  quickTools: RoleContextTool[];
  features?: string[];
  
  // Adding missing properties
  welcomeMessage?: string;
  commandSuggestions?: string[];
}

export const RoleContexts: Record<AIAssistantRole, RoleContext> = {
  general: {
    title: "General Assistant",
    description: "Your everyday personal assistant",
    systemPrompt: "You are a helpful AI assistant.",
    suggestedPrompts: [
      "Help me plan my day",
      "Write a to-do list for me",
      "Give me some productivity tips"
    ],
    quickTools: [
      { name: "Day Planner", icon: "Calendar", description: "Plan your daily schedule" },
      { name: "Task Creator", icon: "CheckSquare", description: "Create and organize tasks" },
      { name: "Quick Answer", icon: "HelpCircle", description: "Get quick answers to questions" },
      { name: "Idea Generator", icon: "Lightbulb", description: "Generate creative ideas" }
    ],
    welcomeMessage: "Hello! I'm your WAKTI AI assistant. How can I help you today?",
    commandSuggestions: [
      "Help me plan my day",
      "Write a to-do list for me",
      "Give me some productivity tips"
    ]
  },
  student: {
    title: "Student Assistant",
    description: "Your academic helper",
    systemPrompt: "You are a helpful AI assistant for students.",
    suggestedPrompts: [
      "Help me prepare for my exam",
      "Explain this concept to me",
      "Create a study schedule for me"
    ],
    quickTools: [
      { name: "Study Planner", icon: "Calendar", description: "Create effective study plans" },
      { name: "Note Summarizer", icon: "FileText", description: "Summarize your notes" },
      { name: "Research Assistant", icon: "Search", description: "Find academic sources" },
      { name: "Concept Explainer", icon: "BookOpen", description: "Get simple explanations" }
    ],
    welcomeMessage: "Hi there! I'm your student assistant. How can I help with your studies today?",
    commandSuggestions: [
      "Help me prepare for my exam",
      "Explain this concept to me",
      "Create a study schedule for me"
    ]
  },
  business_owner: {
    title: "Business Assistant",
    description: "Your business management partner",
    systemPrompt: "You are a helpful AI assistant for business owners.",
    suggestedPrompts: [
      "Create a business plan",
      "Help me with marketing strategies",
      "Analyze my business performance"
    ],
    quickTools: [
      { name: "Staff Scheduler", icon: "Users", description: "Manage your staff schedules" },
      { name: "Business Analytics", icon: "BarChart", description: "Analyze business performance" },
      { name: "Customer Service", icon: "HeartHandshake", description: "Improve customer interactions" },
      { name: "Service Manager", icon: "Settings", description: "Optimize your services" }
    ],
    welcomeMessage: "Welcome! I'm your business assistant. How can I help optimize your business today?",
    commandSuggestions: [
      "Create a business plan",
      "Help me with marketing strategies",
      "Analyze my business performance"
    ]
  },
  employee: {
    title: "Work Assistant",
    description: "Your workplace productivity booster",
    systemPrompt: "You are a helpful AI assistant for professionals.",
    suggestedPrompts: [
      "Draft an email to my boss",
      "Prepare for my presentation",
      "Schedule my team meeting"
    ],
    quickTools: [
      { name: "Email Composer", icon: "Edit", description: "Craft professional emails" },
      { name: "Content Creator", icon: "FileText", description: "Create work documents" },
      { name: "Creative Writing", icon: "Edit", description: "Generate creative content" },
      { name: "Meeting Organizer", icon: "Calendar", description: "Plan effective meetings" }
    ],
    welcomeMessage: "Hello! I'm your work assistant. How can I help boost your productivity today?",
    commandSuggestions: [
      "Draft an email to my boss",
      "Prepare for my presentation",
      "Schedule my team meeting"
    ]
  },
  writer: {
    title: "Writer's Assistant",
    description: "Your creative writing companion",
    systemPrompt: "You are a helpful AI assistant for writers.",
    suggestedPrompts: [
      "Help me outline my story",
      "Give me writing prompts",
      "Edit my paragraph"
    ],
    quickTools: [
      { name: "Content Generator", icon: "Lightbulb", description: "Generate content ideas" },
      { name: "Editor Helper", icon: "Edit", description: "Edit and improve your writing" },
      { name: "Writing Scheduler", icon: "Calendar", description: "Create writing schedules" },
      { name: "Research Tool", icon: "Search", description: "Research for your writing" }
    ],
    welcomeMessage: "Greetings! I'm your writing assistant. How can I help with your creative projects today?",
    commandSuggestions: [
      "Help me outline my story",
      "Give me writing prompts",
      "Edit my paragraph"
    ]
  }
};
