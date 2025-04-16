
import { IntentClassification, ContentCategory } from './types';
import { inappropriateContentKeywords } from './keywords';

/**
 * Checks if the message contains inappropriate content
 */
export function checkForInappropriateContent(message: string): {
  isInappropriate: boolean;
  confidence: number;
  matchedTerms: string[];
  category?: ContentCategory;
} {
  const lowerMessage = message.toLowerCase();
  let isInappropriate = false;
  let confidence = 0;
  const matchedTerms: string[] = [];
  let category: ContentCategory | undefined;
  
  // Check for explicit inappropriate keywords
  for (const keyword of inappropriateContentKeywords.keywords) {
    if (lowerMessage.includes(keyword)) {
      isInappropriate = true;
      confidence += 0.3;
      matchedTerms.push(keyword);
      
      // Categorize the content with proper ContentCategory values
      if (keyword.match(/porn|nude|naked|sex|erotic|xxx/)) {
        category = 'sexual';
      } else if (keyword.match(/violence|violent|gore|blood|kill|murder|suicide|torture/)) {
        category = 'violence';
      } else if (keyword.match(/hate|racist|sexist|terrorism/)) {
        category = 'hate';
      } else {
        category = 'inappropriate';
      }
    }
  }
  
  // Check for contextual phrases that indicate inappropriate intent
  for (const phrase of inappropriateContentKeywords.contextualPhrases) {
    if (lowerMessage.includes(phrase)) {
      isInappropriate = true;
      confidence += 0.4; // Higher confidence for contextual phrases
      matchedTerms.push(phrase);
      
      // Determine category based on the context with proper ContentCategory values
      if (phrase.match(/sexual|nude|naked|porn|adult|explicit/)) {
        category = 'sexual';
      } else if (phrase.match(/violent/)) {
        category = 'violence';
      } else {
        category = 'inappropriate';
      }
    }
  }
  
  // Cap confidence at 0.95
  confidence = Math.min(confidence, 0.95);
  
  return {
    isInappropriate,
    confidence,
    matchedTerms,
    category
  };
}

/**
 * Generate a response for inappropriate content based on category and context
 */
export function getInappropriateContentResponse(
  context: 'image-generation' | 'text-generation',
  category: ContentCategory,
  mode: string
): string {
  if (context === 'image-generation') {
    if (category === 'sexual') {
      return "I'm unable to generate images with adult or explicit sexual content. This is against our content policy. Would you like me to help you with something else?";
    } else if (category === 'violence') {
      return "I can't generate violent or graphic images as they go against our content policy. I'd be happy to help you create a different type of image instead.";
    } else if (category === 'hate') {
      return "I can't generate content that promotes hate speech or discrimination. Would you like me to help you with something more positive?";
    } else {
      return "I'm unable to process this request as it appears to contain inappropriate content that goes against our content policy. Could you try a different prompt?";
    }
  } else {
    // Generic response for text generation
    return "I can't assist with that request as it appears to contain inappropriate content. I'm designed to be helpful, harmless, and honest. Would you like to try asking something else?";
  }
}
