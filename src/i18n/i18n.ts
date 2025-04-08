
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations object for essential booking and common terms
// Also adding AI assistant related translations
const enTranslations = {
  common: {
    copy: "Copy",
    copyToClipboard: "Copied to Clipboard",
    clipboardCopyMessage: "has been copied to clipboard",
    cancel: "Cancel",
    error: "Error"
  },
  booking: {
    reference: "Booking Reference",
    saveReference: "Please save this reference number for your records",
    staffLabel: "Staff:",
    bookedFor: "Booked For:",
    phoneLabel: "Phone:"
  },
  ai: {
    documentAnalysis: "Document Analysis",
    suggestionTitle: "Try asking about:",
    clearChat: "Clear chat",
    closeSidebar: "Close sidebar",
    openSidebar: "Open sidebar",
    settings: "Settings",
    suggestedPrompts: "Suggested Prompts",
    title: "AI Assistant",
    subtitle: "Your personal productivity assistant",
    greeting: "Hello",
    introduction: "I'm your {role}",
    defaultWelcome: "I'm here to help with your tasks, questions, and more. What can I assist you with today?",
    messagePlaceholder: "Type a message...",
    uploadedFilePrompt: "I've uploaded {name}. Can you analyze it for me?",
    fileUploaded: "File Uploaded",
    fileUploadSuccess: "{name} has been uploaded",
    fileTooLarge: "File too large",
    fileSizeLimit: "Maximum file size is 10MB",
    uploadFailed: "Upload Failed",
    tryAgain: "Please try again",
    cameraError: "Camera Error",
    checkPermissions: "Please check your camera permissions",
    photoTaken: "Photo Taken",
    photoReady: "Your photo is ready for analysis",
    photoTakenPrompt: "I've taken a photo. Can you analyze what's in it?",
    takePicture: "Take Picture",
    accessError: "Access Error",
    verifyAccountError: "Please verify your account status",
    roleUpdateError: "Failed to update AI role",
    tapToSend: "Tap send button to submit your message",
    pressEnter: "Press Enter to send, Shift+Enter for new line",
    sendMessage: "Send message",
    startVoice: "Start voice input",
    stopVoice: "Stop voice input",
    attachFile: "Attach file",
    takePhoto: "Take photo",
    notAvailable: "AI Assistant Not Available",
    staffRestriction: "This feature is not available for staff accounts",
    businessTools: "Business Tools",
    creativeTools: "Creative Tools",
    system: "System",
    upgradeToUnlock: "Upgrade to unlock AI Assistant",
    upgradeToAccess: "Upgrade to access the AI Assistant",
    upgradeNow: "Upgrade Now",
    upgradeDescription: "WAKTI's AI Assistant helps boost your productivity with intelligent task management, appointment scheduling, and business insights. Available with Individual and Business plans.",
    plansStartAt: "Plans start at QAR 20/month",
    tabs: {
      chat: "Chat",
      tools: "Tools",
      knowledge: "Knowledge",
      history: "History"
    },
    roles: {
      general: "AI Assistant",
      student: "Student Assistant",
      employee: "Work Assistant",
      writer: "Creative Assistant", 
      business: "Business Assistant"
    },
    toolsFor: {
      general: "Assistant Tools",
      student: "Student Tools",
      business_owner: "Business Tools"
    },
    welcomeMessages: {
      general: "I can help with tasks, scheduling, messaging, and more. What would you like assistance with today?",
      student: "I can help with study planning, research, writing assignments, and organizing your academic schedule.",
      employee: "I can help with work tasks, team coordination, professional emails, and productivity improvements.",
      writer: "I can help with creative writing, content ideas, editing, and organizing your writing projects.",
      business_owner: "I can help with business planning, customer communications, staff management, and productivity strategies."
    },
    features: {
      taskManagement: "Smart Task Management",
      taskDescription: "Prioritizes and organizes your tasks",
      analytics: "Business Analytics",
      analyticsDescription: "Provides insights to grow your business",
      messages: "Draft Messages",
      messagesDescription: "Creates professional communications",
      booking: "Booking Assistance",
      bookingDescription: "Helps manage your calendar efficiently"
    },
    sampleHistory: {
      efficiency: "How to improve team efficiency",
      marketing: "Marketing strategy ideas",
      studyPlan: "Create a study plan for exams"
    },
    timeAgo: {
      days: "{{count}} days ago",
      week: "{{count}} week ago",
      weeks: "{{count}} weeks ago"
    }
  }
};

// Initialize i18next with English-only configuration
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Set document direction to LTR for English
document.documentElement.dir = 'ltr';
document.documentElement.lang = 'en';
document.body.classList.remove('rtl');
document.body.classList.remove('font-arabic');

// Simple export
export default i18n;
