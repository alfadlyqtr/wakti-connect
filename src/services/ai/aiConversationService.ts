
import { AIAssistantRole } from "@/types/ai-assistant.types";

export enum UserIntent {
  GENERAL_QUESTION = "GENERAL_QUESTION",
  TASK_CREATION = "TASK_CREATION",
  TASK_SUGGESTION = "TASK_SUGGESTION",
  EVENT_CREATION = "EVENT_CREATION",
  CREATIVE_REQUEST = "CREATIVE_REQUEST",
  ACADEMIC_HELP = "ACADEMIC_HELP",
  BUSINESS_INQUIRY = "BUSINESS_INQUIRY",
  CHAT_CONTINUATION = "CHAT_CONTINUATION"
}

/**
 * Detects user intent from message text to provide more contextual responses
 */
export function detectUserIntent(message: string, currentRole: AIAssistantRole): UserIntent {
  const lowerMessage = message.toLowerCase();
  
  // Direct task creation intent
  if (
    lowerMessage.includes("create a task") || 
    lowerMessage.includes("add a task") || 
    lowerMessage.includes("make a task") ||
    lowerMessage.includes("set a reminder")
  ) {
    return UserIntent.TASK_CREATION;
  }
  
  // Academic help intent
  if (
    (currentRole === "student" || 
    lowerMessage.includes("help me with") || 
    lowerMessage.includes("solve this") || 
    lowerMessage.includes("how do i calculate") ||
    lowerMessage.includes("what is the answer")) &&
    (lowerMessage.includes("math") || 
     lowerMessage.includes("science") || 
     lowerMessage.includes("homework") || 
     lowerMessage.includes("assignment") ||
     lowerMessage.includes("problem") ||
     lowerMessage.includes("equation"))
  ) {
    return UserIntent.ACADEMIC_HELP;
  }
  
  // Creative request intent
  if (
    (currentRole === "writer" || currentRole === "employee") &&
    (lowerMessage.includes("write") || 
     lowerMessage.includes("create") || 
     lowerMessage.includes("design") || 
     lowerMessage.includes("generate") ||
     lowerMessage.includes("compose") ||
     lowerMessage.includes("draft"))
  ) {
    return UserIntent.CREATIVE_REQUEST;
  }
  
  // Business inquiry intent
  if (
    currentRole === "business_owner" &&
    (lowerMessage.includes("staff") || 
     lowerMessage.includes("analytics") || 
     lowerMessage.includes("business") || 
     lowerMessage.includes("customer") ||
     lowerMessage.includes("booking") ||
     lowerMessage.includes("appointment"))
  ) {
    return UserIntent.BUSINESS_INQUIRY;
  }
  
  // Potential task suggestion (task-like statement that wasn't explicitly requesting task creation)
  if (
    (lowerMessage.includes("i need to") || 
     lowerMessage.includes("i have to") || 
     lowerMessage.includes("don't forget to") || 
     lowerMessage.includes("remember to")) &&
    !lowerMessage.includes("?")
  ) {
    return UserIntent.TASK_SUGGESTION;
  }
  
  // Event or appointment creation
  if (
    lowerMessage.includes("schedule") || 
    lowerMessage.includes("appointment") || 
    lowerMessage.includes("meet") || 
    lowerMessage.includes("event")
  ) {
    return UserIntent.EVENT_CREATION;
  }
  
  // Default to general question or chat continuation
  return lowerMessage.includes("?") ? 
    UserIntent.GENERAL_QUESTION : 
    UserIntent.CHAT_CONTINUATION;
}

/**
 * Gets mode-specific placeholder text based on the current role
 */
export function getModePlaceholderText(role: AIAssistantRole): string {
  switch (role) {
    case "student":
      return "Need help with your homework or studies?";
    case "employee":
    case "writer":
      return "Let's brainstorm or create something fun...";
    case "business_owner":
      return "Need help running your business account?";
    default:
      return "Ask me anything...";
  }
}

/**
 * Gets contextual suggestion prompts based on detected intent and role
 */
export function getContextualSuggestions(
  intent: UserIntent, 
  role: AIAssistantRole
): string[] {
  switch (intent) {
    case UserIntent.TASK_SUGGESTION:
      return [
        "Would you like me to create a task for this?",
        "Should I set up a reminder for you?",
        "I can add this to your task list if you'd like."
      ];
    case UserIntent.ACADEMIC_HELP:
      return [
        "I can walk you through this step-by-step.",
        "Would you like me to explain the concept differently?",
        "Try solving it yourself first, then I can check your work."
      ];
    case UserIntent.CREATIVE_REQUEST:
      return [
        "What tone would you like this in?",
        "Would you like me to generate a few variations?",
        "I can help refine this once you have a draft."
      ];
    case UserIntent.BUSINESS_INQUIRY:
      return [
        "I can analyze your business data for insights.",
        "Would you like to see your staff performance metrics?",
        "I can help you manage your business workflows."
      ];
    default:
      if (role === "student") {
        return [
          "Upload a photo of your assignment for help.",
          "I can explain difficult concepts in simple terms.",
          "Ask me about any subject you're studying."
        ];
      } else if (role === "writer" || role === "employee") {
        return [
          "Need help writing an email or message?",
          "I can brainstorm creative ideas with you.",
          "Let me help you draft a professional document."
        ];
      } else if (role === "business_owner") {
        return [
          "How can I help optimize your business operations?",
          "Would you like to check on your staff or bookings?",
          "I can help you analyze your business performance."
        ];
      } else {
        return [
          "How can I assist you today?",
          "Ask me about your tasks or schedule.",
          "I'm here to help with whatever you need."
        ];
      }
  }
}

/**
 * Determines if a response should include task creation suggestion
 * based on intent and message content
 */
export function shouldSuggestTaskCreation(intent: UserIntent, message: string): boolean {
  if (intent === UserIntent.TASK_SUGGESTION) {
    return true;
  }
  
  if (intent === UserIntent.GENERAL_QUESTION || intent === UserIntent.CHAT_CONTINUATION) {
    const lowerMessage = message.toLowerCase();
    
    // Check for time indicators that might suggest a task
    const hasTimeIndicator = 
      lowerMessage.includes("tomorrow") || 
      lowerMessage.includes("tonight") || 
      lowerMessage.includes("next week") ||
      lowerMessage.includes("on monday") ||
      lowerMessage.includes("on tuesday") ||
      lowerMessage.includes("on wednesday") ||
      lowerMessage.includes("on thursday") ||
      lowerMessage.includes("on friday") ||
      lowerMessage.includes("on saturday") ||
      lowerMessage.includes("on sunday") ||
      /at \d{1,2}(?::\d{2})?\s*(?:am|pm)/i.test(lowerMessage);
    
    // Check for action verbs that might suggest a task
    const hasActionVerb =
      lowerMessage.includes("buy") ||
      lowerMessage.includes("call") ||
      lowerMessage.includes("pick up") ||
      lowerMessage.includes("send") ||
      lowerMessage.includes("finish") ||
      lowerMessage.includes("complete");
    
    return hasTimeIndicator && hasActionVerb;
  }
  
  return false;
}

/**
 * Enhances the AI response by adding contextual guidance based on the mode
 */
export function enhanceAIResponse(
  originalResponse: string, 
  intent: UserIntent,
  role: AIAssistantRole
): string {
  // Add mode-specific enhancements
  let enhancedResponse = originalResponse;
  
  if (role === "student" && intent === UserIntent.ACADEMIC_HELP) {
    // Add learning prompts for student mode
    enhancedResponse += "\n\nWould you like me to:\n- Explain this further?\n- Give you practice problems?\n- Break this down step-by-step?";
  } else if ((role === "writer" || role === "employee") && intent === UserIntent.CREATIVE_REQUEST) {
    // Add creative follow-ups
    enhancedResponse += "\n\nI can help you refine this further. Would you like me to:\n- Suggest alternative approaches?\n- Enhance the language?\n- Tailor it for a specific audience?";
  } else if (role === "business_owner" && intent === UserIntent.BUSINESS_INQUIRY) {
    // Add business insights
    enhancedResponse += "\n\nI can provide more detailed business insights. Would you like to:\n- See specific analytics?\n- Compare performance periods?\n- Get recommendations for improvement?";
  }
  
  return enhancedResponse;
}
