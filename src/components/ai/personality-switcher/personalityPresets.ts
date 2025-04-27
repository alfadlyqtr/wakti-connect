
import { AIPersonality, WAKTIAIMode } from './types';

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
      bgColor: '#f0f7ff',
      textColor: '#1e293b',
      buttonColor: '#3b82f6',
      accentColor: '#3b82f6'
    },
    darkTheme: {
      bgColor: '#0f172a',
      textColor: '#f8fafc', 
      buttonColor: '#60a5fa',
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
      bgColor: '#f0fdf4',
      textColor: '#1e293b',
      buttonColor: '#22c55e',
      accentColor: '#22c55e'
    },
    darkTheme: {
      bgColor: '#0f2617',
      textColor: '#f8fafc',
      buttonColor: '#4ade80',
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
      bgColor: '#f5f3ff',
      textColor: '#1e293b',
      buttonColor: '#8b5cf6',
      accentColor: '#8b5cf6'
    },
    darkTheme: {
      bgColor: '#1e1b4b',
      textColor: '#f8fafc',
      buttonColor: '#a78bfa',
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
      bgColor: '#fdf2f8',
      textColor: '#1e293b',
      buttonColor: '#d946ef',
      accentColor: '#d946ef'
    },
    darkTheme: {
      bgColor: '#2d1b36',
      textColor: '#f8fafc',
      buttonColor: '#e879f9',
      accentColor: '#e879f9'
    }
  },
  // Adding the additional required modes to satisfy the WAKTIAIMode type
  employee: {
    id: 'employee',
    name: 'Employee Assistant',
    title: 'Employee Mode',
    description: 'Your assistant for workplace productivity and organization',
    systemPrompt: 'You are an employee-focused AI assistant. Help with workplace tasks, meetings, communications, and professional development.',
    welcomeMessage: 'Hello! I\'m your Employee Assistant. I can help with workplace tasks, meeting notes, project management, or professional development. How can I assist you today?',
    suggestedPrompts: [
      'Create a meeting agenda',
      'Help me prioritize my tasks',
      'Draft an email to my team',
      'Suggest professional development resources'
    ],
    color: 'bg-blue-600',
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'bg-gradient-to-r from-blue-50 to-blue-100/50',
    iconColor: 'text-blue-600',
    mode: 'employee',
    lightTheme: {
      bgColor: '#f0f7ff',
      textColor: '#1e293b',
      buttonColor: '#3b82f6',
      accentColor: '#3b82f6'
    },
    darkTheme: {
      bgColor: '#1e3a8a',
      textColor: '#f8fafc',
      buttonColor: '#60a5fa',
      accentColor: '#60a5fa'
    }
  },
  writer: {
    id: 'writer',
    name: 'Writer Assistant',
    title: 'Writer Mode',
    description: 'Your assistant for creative and professional writing',
    systemPrompt: 'You are a writing-focused AI assistant. Help with drafting, editing, and improving all types of written content.',
    welcomeMessage: 'Welcome to Writer Mode! I can help you craft compelling content, edit your writing, generate ideas, or provide feedback. What would you like to work on today?',
    suggestedPrompts: [
      'Help me draft a blog post',
      'Edit this paragraph for clarity',
      'Suggest a catchy headline',
      'Create an outline for my article'
    ],
    color: 'bg-amber-600',
    gradient: 'from-amber-500 to-amber-600',
    bgGradient: 'bg-gradient-to-r from-amber-50 to-amber-100/50',
    iconColor: 'text-amber-600',
    mode: 'writer',
    lightTheme: {
      bgColor: '#fffbeb',
      textColor: '#1e293b',
      buttonColor: '#d97706',
      accentColor: '#d97706'
    },
    darkTheme: {
      bgColor: '#451a03',
      textColor: '#f8fafc',
      buttonColor: '#f59e0b',
      accentColor: '#f59e0b'
    }
  },
  business_owner: {
    id: 'business_owner',
    name: 'Business Owner',
    title: 'Business Owner Mode',
    description: 'Your strategic partner for business management',
    systemPrompt: 'You are a business-focused AI assistant. Help with strategic planning, marketing, customer relations, and operational decisions.',
    welcomeMessage: 'Hello! I\'m your Business Owner Assistant. I can help with business strategy, marketing plans, customer insights, or operational improvements. What aspect of your business would you like to focus on?',
    suggestedPrompts: [
      'Create a marketing plan outline',
      'Analyze this customer feedback',
      'Help me improve my business operations',
      'Draft a business proposal'
    ],
    color: 'bg-emerald-600',
    gradient: 'from-emerald-500 to-emerald-600',
    bgGradient: 'bg-gradient-to-r from-emerald-50 to-emerald-100/50',
    iconColor: 'text-emerald-600',
    mode: 'business_owner',
    lightTheme: {
      bgColor: '#ecfdf5',
      textColor: '#1e293b',
      buttonColor: '#10b981',
      accentColor: '#10b981'
    },
    darkTheme: {
      bgColor: '#064e3b',
      textColor: '#f8fafc',
      buttonColor: '#34d399',
      accentColor: '#34d399'
    }
  }
};
