
import { AIPersonality, WAKTIAIMode } from '@/types/ai-assistant.types';

export const personalityPresets: Record<WAKTIAIMode, AIPersonality> = {
  general: {
    id: 'general',
    name: 'General Assistant',
    title: 'General Chat',
    description: 'Ask me anything - I can help with a variety of questions',
    systemPrompt: 'You are a helpful, friendly AI assistant. Provide clear, concise responses to user questions across a wide range of topics.',
    welcomeMessage: 'Hello! I\'m your AI assistant. I can help with questions, create tasks, assist with scheduling, or just chat. What would you like to talk about today?',
    suggestedPrompts: [
      'How can I get the most out of WAKTI?',
      'What features are available in my account?',
      'Can you help me find something specific?',
      'Tell me about task management in WAKTI'
    ],
    color: 'bg-wakti-blue',
    gradient: 'from-blue-500 to-wakti-blue',
    bgGradient: 'bg-gradient-to-r from-blue-50 to-blue-100/50',
    iconColor: 'text-wakti-blue',
    mode: 'general',
    lightTheme: {
      backgroundColor: '#f0f7ff',
      chatBgColor: 'rgba(255, 255, 255, 0.7)',
      messageColor: '#1e293b',
      accentColor: '#3b82f6'
    },
    darkTheme: {
      backgroundColor: '#0f172a',
      chatBgColor: 'rgba(15, 23, 42, 0.7)',
      messageColor: '#f8fafc',
      accentColor: '#60a5fa'
    }
  },
  student: {
    id: 'student',
    name: 'Student Assistant',
    title: 'Student Mode',
    description: 'Your study partner, tutor and research assistant',
    systemPrompt: 'You are a helpful, encouraging educational assistant. Help with homework, explain concepts clearly, provide study tips, and break down complex topics into digestible information.',
    welcomeMessage: 'Hi there! I\'m your Student Assistant. I can help with homework, research, study plans, or explaining difficult concepts. What are you working on today?',
    suggestedPrompts: [
      'Can you explain this concept to me?',
      'Help me create a study plan for my exam',
      'Summarize this article for my research',
      'Give me practice questions about this topic'
    ],
    color: 'bg-green-600',
    gradient: 'from-green-500 to-green-600',
    bgGradient: 'bg-gradient-to-r from-green-50 to-green-100/50',
    iconColor: 'text-green-600',
    mode: 'student',
    lightTheme: {
      backgroundColor: '#f0fdf4',
      chatBgColor: 'rgba(255, 255, 255, 0.7)',
      messageColor: '#1e293b',
      accentColor: '#22c55e'
    },
    darkTheme: {
      backgroundColor: '#0f2617',
      chatBgColor: 'rgba(15, 38, 23, 0.7)',
      messageColor: '#f8fafc',
      accentColor: '#4ade80'
    }
  },
  productivity: {
    id: 'productivity',
    name: 'Productivity Assistant',
    title: 'Productivity Mode',
    description: 'Your personal assistant for tasks, scheduling and organization',
    systemPrompt: 'You are a productivity-focused AI assistant. Help users manage their tasks, create schedules, set reminders, and optimize their workflows. Be efficient, clear, and focused on actionable advice.',
    welcomeMessage: 'Ready to be productive! I can help you manage tasks, organize your schedule, create reminders, or optimize your workflow. What would you like to accomplish today?',
    suggestedPrompts: [
      'Create a new task for me',
      'Help me organize my schedule',
      'I need a reminder for an upcoming deadline',
      'How can I improve my workflow?'
    ],
    color: 'bg-purple-600',
    gradient: 'from-purple-500 to-purple-600',
    bgGradient: 'bg-gradient-to-r from-purple-50 to-purple-100/50',
    iconColor: 'text-purple-600',
    mode: 'productivity',
    lightTheme: {
      backgroundColor: '#f5f3ff',
      chatBgColor: 'rgba(255, 255, 255, 0.7)',
      messageColor: '#1e293b',
      accentColor: '#8b5cf6'
    },
    darkTheme: {
      backgroundColor: '#1e1b4b',
      chatBgColor: 'rgba(30, 27, 75, 0.7)',
      messageColor: '#f8fafc',
      accentColor: '#a78bfa'
    }
  },
  creative: {
    id: 'creative',
    name: 'Creative Assistant',
    title: 'Creative Mode',
    description: 'Your creative partner for ideas, content and design',
    systemPrompt: 'You are a creative AI assistant. Help users generate ideas, draft content, design visuals, and explore artistic concepts. Be imaginative, innovative, and inspiring in your responses.',
    welcomeMessage: 'Welcome to the Creative Studio! I can help with brainstorming ideas, generating content, suggesting designs, or exploring creative concepts. What would you like to create today?',
    suggestedPrompts: [
      'Help me brainstorm ideas for my project',
      'Draft a creative description for my business',
      'Suggest a design for my presentation',
      'I need help with creative writing'
    ],
    color: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500',
    gradient: 'from-pink-500 via-purple-500 to-indigo-500',
    bgGradient: 'bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50',
    iconColor: 'text-purple-500',
    mode: 'creative',
    lightTheme: {
      backgroundColor: '#fdf2f8',
      chatBgColor: 'rgba(255, 255, 255, 0.7)',
      messageColor: '#1e293b',
      accentColor: '#d946ef'
    },
    darkTheme: {
      backgroundColor: '#2d1b36',
      chatBgColor: 'rgba(45, 27, 54, 0.7)',
      messageColor: '#f8fafc',
      accentColor: '#e879f9'
    }
  },
  employee: {
    id: 'employee',
    name: 'Employee Assistant',
    title: 'Work Mode',
    description: 'Your professional assistant for workplace tasks',
    systemPrompt: 'You are a professional assistant helping with workplace tasks and communication. Provide clear, professional guidance on workplace matters.',
    welcomeMessage: 'Hello! I can help with workplace communication, reports, and professional tasks. What do you need assistance with today?',
    suggestedPrompts: [
      'Draft an email to my team',
      'Help with a presentation',
      'Professional writing tips',
      'Create meeting minutes'
    ],
    color: 'bg-indigo-600',
    gradient: 'from-indigo-500 to-indigo-600',
    bgGradient: 'bg-gradient-to-r from-indigo-50 to-indigo-100/50',
    iconColor: 'text-indigo-600',
    mode: 'employee',
    lightTheme: {
      backgroundColor: '#eef2ff',
      chatBgColor: 'rgba(255, 255, 255, 0.7)',
      messageColor: '#1e293b',
      accentColor: '#6366f1'
    },
    darkTheme: {
      backgroundColor: '#1e1b4b',
      chatBgColor: 'rgba(30, 27, 75, 0.7)',
      messageColor: '#f8fafc',
      accentColor: '#818cf8'
    }
  },
  writer: {
    id: 'writer',
    name: 'Writer Assistant',
    title: 'Writer Mode',
    description: 'Your writing partner for all content needs',
    systemPrompt: 'You are a writing assistant specializing in content creation, editing, and improvement. Help with clear, engaging, and effective writing across various formats.',
    welcomeMessage: 'Hello! Ready to write something amazing today? How can I assist with your writing?',
    suggestedPrompts: [
      'Help me write an article',
      'Proofread my text',
      'Improve this paragraph',
      'Generate blog ideas'
    ],
    color: 'bg-emerald-600',
    gradient: 'from-emerald-500 to-emerald-600',
    bgGradient: 'bg-gradient-to-r from-emerald-50 to-emerald-100/50',
    iconColor: 'text-emerald-600',
    mode: 'writer',
    lightTheme: {
      backgroundColor: '#ecfdf5',
      chatBgColor: 'rgba(255, 255, 255, 0.7)',
      messageColor: '#1e293b',
      accentColor: '#10b981'
    },
    darkTheme: {
      backgroundColor: '#064e3b',
      chatBgColor: 'rgba(6, 78, 59, 0.7)',
      messageColor: '#f8fafc',
      accentColor: '#34d399'
    }
  },
  business_owner: {
    id: 'business_owner',
    name: 'Business Owner Assistant',
    title: 'Business Mode',
    description: 'Your strategic partner for business operations',
    systemPrompt: 'You are a business assistant specializing in strategy, operations, marketing, and management. Provide actionable business advice and insights.',
    welcomeMessage: 'Hello! I can assist with your business operations and strategy. How can I help you today?',
    suggestedPrompts: [
      'Help with business planning',
      'Marketing strategy ideas',
      'Customer engagement tips',
      'Competitive analysis guidance'
    ],
    color: 'bg-amber-600',
    gradient: 'from-amber-500 to-amber-600',
    bgGradient: 'bg-gradient-to-r from-amber-50 to-amber-100/50',
    iconColor: 'text-amber-600',
    mode: 'business_owner',
    lightTheme: {
      backgroundColor: '#fffbeb',
      chatBgColor: 'rgba(255, 255, 255, 0.7)',
      messageColor: '#1e293b',
      accentColor: '#d97706'
    },
    darkTheme: {
      backgroundColor: '#78350f',
      chatBgColor: 'rgba(120, 53, 15, 0.7)',
      messageColor: '#f8fafc',
      accentColor: '#fbbf24'
    }
  }
};
