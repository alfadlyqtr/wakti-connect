
import { ContentCategory } from './types';
import { WAKTIAIMode } from '@/types/ai-assistant.types';

// Function to get appropriate response for inappropriate content
export function getInappropriateContentResponse(
  originalIntentType: string,
  contentCategory: ContentCategory,
  currentMode: WAKTIAIMode
): string {
  // Base response templates for different types of inappropriate content
  const baseResponses: Record<ContentCategory, string> = {
    'inappropriate': "I'm not able to respond to that request as it appears to contain inappropriate content.",
    'explicit': "I can't generate or respond to explicit content requests.",
    'adult': "I can't generate images with adult content or respond to these types of requests.",
    'nudity': "I'm not able to generate or describe images containing nudity.",
    'violence': "I cannot produce violent or harmful content as requested.",
    'hate': "I cannot generate content that contains hate speech or discriminatory language.",
    'harassment': "I cannot create content that could be offensive or hurtful to others.",
    'self-harm': "I cannot provide content related to self-harm. If you're in crisis, please contact a mental health professional.",
    'sexual': "I cannot generate sexual or explicit adult content as it violates our content policy."
  };
  
  // Create a more personalized response based on the user's intent and current AI mode
  let response = baseResponses[contentCategory] || baseResponses.inappropriate;
  
  // Add context based on original intent
  if (originalIntentType === 'image-generation') {
    response += " I'm designed to create appropriate, helpful imagery. ";
  } else {
    response += " I'm designed to provide helpful, appropriate information and assistance. ";
  }
  
  // Add mode-specific suggestions for alternative use
  switch (currentMode) {
    case 'general':
      response += "I'd be happy to help with general questions, tasks, or other appropriate assistance instead.";
      break;
    case 'creative':
      response += "I can still help with creative writing, brainstorming ideas, or other appropriate creative tasks instead.";
      break;
    case 'productivity':
      response += "I can assist with productivity tasks, planning, and organization in appropriate ways instead.";
      break;
    case 'student':
      response += "I'm here to provide educational content and study assistance in appropriate ways instead.";
      break;
    default:
      response += "I'd be happy to help with other appropriate requests instead.";
  }
  
  return response;
}
