
import { WAKTIAIMode } from "@/types/ai-assistant.types";

// Intent types that our AI system can handle
export type IntentType = 
  | 'task-creation'
  | 'image-generation'
  | 'general-question'
  | 'learning-request'
  | 'creative-content'
  | 'email-composition'
  | 'data-analysis'
  | 'confirmation'
  | 'rejection'
  | 'clarification'
  | 'unknown';

export interface IntentClassification {
  intentType: IntentType;
  confidence: number; // 0-1 score of confidence
  relevantKeywords: string[];
  suggestedMode?: WAKTIAIMode;
  metadata?: Record<string, any>;
}

// Intent classification patterns mapped by intent type
const intentPatterns: Record<IntentType, {
  keywords: string[];
  phrases: string[];
  prefixes: string[];
  confidence: number;
  suggestedMode?: WAKTIAIMode;
}> = {
  'task-creation': {
    keywords: ['task', 'todo', 'to-do', 'reminder', 'schedule', 'appointment', 'meeting', 'deadline', 'project'],
    phrases: ['create a task', 'add a task', 'remind me to', 'set a reminder', 'schedule a', 'add to my calendar'],
    prefixes: ['remind me', 'schedule', 'create task'],
    confidence: 0.7,
    suggestedMode: 'productivity'
  },
  'image-generation': {
    keywords: ['image', 'picture', 'photo', 'drawing', 'illustration', 'artwork', 'generate', 'create', 'draw'],
    phrases: ['generate an image', 'create a picture', 'make an image', 'draw a', 'show me an image', 'create an illustration'],
    prefixes: ['draw', 'generate image', 'create image'],
    confidence: 0.8,
    suggestedMode: 'creative'
  },
  'general-question': {
    keywords: ['what', 'who', 'when', 'where', 'why', 'how', 'explain', 'tell me', 'question'],
    phrases: ['tell me about', 'what is', 'explain', 'help me understand'],
    prefixes: ['what', 'who', 'when', 'where', 'why', 'how'],
    confidence: 0.6,
    suggestedMode: 'general'
  },
  'learning-request': {
    keywords: ['learn', 'study', 'teach', 'understand', 'explain', 'course', 'lesson', 'education', 'tutorial'],
    phrases: ['help me understand', 'teach me about', 'explain how', 'I want to learn'],
    prefixes: ['teach me', 'explain', 'how do I'],
    confidence: 0.7,
    suggestedMode: 'student'
  },
  'creative-content': {
    keywords: ['write', 'compose', 'create', 'story', 'poem', 'song', 'creative', 'idea', 'brainstorm'],
    phrases: ['write a story', 'create content', 'come up with ideas', 'brainstorm', 'help me write'],
    prefixes: ['write', 'compose', 'create'],
    confidence: 0.7,
    suggestedMode: 'creative'
  },
  'email-composition': {
    keywords: ['email', 'draft', 'message', 'reply', 'write', 'compose', 'send'],
    phrases: ['write an email', 'draft a reply', 'compose a message', 'help me respond to'],
    prefixes: ['write email', 'compose email', 'draft email'],
    confidence: 0.8,
    suggestedMode: 'productivity'
  },
  'data-analysis': {
    keywords: ['analyze', 'report', 'data', 'statistics', 'trends', 'metrics', 'performance', 'numbers'],
    phrases: ['analyze the data', 'generate a report', 'show me the trends', 'what are the statistics'],
    prefixes: ['analyze', 'report on', 'summarize data'],
    confidence: 0.7,
    suggestedMode: 'productivity'
  },
  'confirmation': {
    keywords: ['yes', 'confirm', 'approve', 'ok', 'okay', 'sure', 'go ahead', 'correct', 'right', 'exactly'],
    phrases: ['yes, that looks good', 'go ahead', 'please proceed', 'that is correct'],
    prefixes: ['yes', 'ok', 'sure', 'correct'],
    confidence: 0.9,
    suggestedMode: undefined
  },
  'rejection': {
    keywords: ['no', 'cancel', 'stop', 'don\'t', 'incorrect', 'wrong', 'not right', 'mistake'],
    phrases: ['no, that\'s wrong', 'please cancel', 'stop that', 'that is incorrect'],
    prefixes: ['no', 'cancel', 'stop', 'don\'t'],
    confidence: 0.9,
    suggestedMode: undefined
  },
  'clarification': {
    keywords: ['clarify', 'explain', 'what do you mean', 'confused', 'unclear', 'don\'t understand'],
    phrases: ['I don\'t understand', 'please clarify', 'what do you mean', 'can you explain'],
    prefixes: ['clarify', 'explain', 'what do you mean'],
    confidence: 0.7,
    suggestedMode: 'general'
  },
  'unknown': {
    keywords: [],
    phrases: [],
    prefixes: [],
    confidence: 0.3,
    suggestedMode: 'general'
  }
};

/**
 * Analyzes a user message to determine its likely intent
 */
export function classifyIntent(message: string): IntentClassification {
  // Normalize message for better matching
  const normalizedMessage = message.toLowerCase().trim();
  
  // Track the matched keywords for debugging/explanation
  let relevantKeywords: string[] = [];
  
  // Default to unknown intent with low confidence
  let bestMatch: IntentType = 'unknown';
  let highestScore = 0.1; // Start with a minimal base confidence
  let suggestedMode: WAKTIAIMode | undefined = undefined;
  
  // Helper function to check if message contains a keyword
  const containsKeyword = (keyword: string) => {
    // Match whole words only
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    return regex.test(normalizedMessage);
  };
  
  // Helper function to check if message contains a phrase
  const containsPhrase = (phrase: string) => {
    return normalizedMessage.includes(phrase.toLowerCase());
  };
  
  // Helper function to check if message starts with a prefix
  const startsWithPrefix = (prefix: string) => {
    return normalizedMessage.startsWith(prefix.toLowerCase());
  };
  
  // Check each intent pattern for matches
  Object.entries(intentPatterns).forEach(([intentType, pattern]) => {
    if (intentType === 'unknown') return; // Skip the unknown intent
    
    let score = 0;
    const matchedKeywords: string[] = [];
    
    // Check for keywords (medium impact)
    pattern.keywords.forEach(keyword => {
      if (containsKeyword(keyword)) {
        score += 0.15;
        matchedKeywords.push(keyword);
      }
    });
    
    // Check for phrases (high impact)
    pattern.phrases.forEach(phrase => {
      if (containsPhrase(phrase)) {
        score += 0.25;
        matchedKeywords.push(phrase);
      }
    });
    
    // Check for prefixes (highest impact)
    pattern.prefixes.forEach(prefix => {
      if (startsWithPrefix(prefix)) {
        score += 0.35;
        matchedKeywords.push(prefix);
      }
    });
    
    // Normalize score based on pattern confidence
    score = Math.min(score * pattern.confidence, 0.95);
    
    // Special case for image generation (higher specificity)
    if (intentType === 'image-generation' && 
        (containsPhrase('generate an image') || 
         containsPhrase('create an image') || 
         containsPhrase('make an image') ||
         containsPhrase('draw me') ||
         containsPhrase('show me an image of'))) {
      score += 0.3;
    }
    
    // Special case for task creation in productivity mode
    if (intentType === 'task-creation' && 
        (containsPhrase('remind me to') || 
         containsPhrase('set a reminder') ||
         startsWithPrefix('create a task'))) {
      score += 0.3;
    }
    
    // Update best match if this intent has a higher score
    if (score > highestScore) {
      highestScore = score;
      bestMatch = intentType as IntentType;
      relevantKeywords = matchedKeywords;
      suggestedMode = pattern.suggestedMode;
    }
  });
  
  // Handle specific edge cases with context-specific analysis
  if (bestMatch === 'unknown' || highestScore < 0.5) {
    // Check for sports-related questions
    if (/\b(sports|team|game|player|score|match|athlete|basketball|football|soccer|baseball|hockey)\b/i.test(normalizedMessage)) {
      bestMatch = 'general-question';
      highestScore = Math.max(highestScore, 0.6);
      relevantKeywords.push('sports');
    }
    
    // Check for math/calculation questions
    if (/\b(calculate|compute|math|equation|formula|solve|problem|sum|difference|product|division)\b/i.test(normalizedMessage)) {
      bestMatch = 'general-question';
      highestScore = Math.max(highestScore, 0.6);
      relevantKeywords.push('math');
    }
    
    // Check for travel-related questions
    if (/\b(travel|trip|vacation|flight|hotel|booking|destination|ticket|reservation|tourism)\b/i.test(normalizedMessage)) {
      bestMatch = 'general-question';
      highestScore = Math.max(highestScore, 0.6);
      relevantKeywords.push('travel');
    }
  }
  
  // Log the classification for debugging
  console.log(`[Intent Classifier] Message classified as '${bestMatch}' (${highestScore.toFixed(2)}) with keywords: ${relevantKeywords.join(', ')}`);
  
  return {
    intentType: bestMatch,
    confidence: highestScore,
    relevantKeywords,
    suggestedMode
  };
}
