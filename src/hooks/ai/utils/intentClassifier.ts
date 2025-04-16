
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
  | 'inappropriate-content'  // New intent type for inappropriate content
  | 'unknown';

export interface IntentClassification {
  intentType: IntentType;
  confidence: number; // 0-1 score of confidence
  relevantKeywords: string[];
  suggestedMode?: WAKTIAIMode;
  metadata?: Record<string, any>;
  isSafeContent?: boolean; // New flag to indicate if content is safe
  contentCategory?: string; // New field for content categorization
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
  'inappropriate-content': {
    keywords: ['nude', 'naked', 'sexual', 'porn', 'explicit', 'adult', 'nsfw', 'x-rated', 'sex', 'erotic'],
    phrases: ['show me nude', 'generate sexual content', 'create adult images', 'nsfw content', 'explicit material'],
    prefixes: ['generate nude', 'create sexual', 'show explicit'],
    confidence: 0.9,
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

// Content safety patterns to detect inappropriate content
const contentSafetyPatterns = {
  inappropriate: {
    keywords: [
      'nude', 'naked', 'sexual', 'porn', 'pornographic', 'explicit', 'adult', 'nsfw', 
      'x-rated', 'sex', 'erotic', 'arousing', 'seductive', 'provocative', 
      'intimate parts', 'private parts', 'genital', 'genitalia', 'obscene'
    ],
    contextualPhrases: [
      'with no clothes', 'without clothes', 'wearing nothing', 'not wearing anything',
      'in the bedroom', 'in an intimate position', 'showing everything',
      'uncensored', 'explicit content', 'adult content', 'sexually suggestive'
    ]
  },
  violence: {
    keywords: [
      'gore', 'blood', 'violent', 'murder', 'kill', 'death', 'torture', 'weapon',
      'suicide', 'self-harm', 'gruesome', 'brutal', 'attack'
    ]
  },
  harassment: {
    keywords: [
      'hate', 'racist', 'discrimination', 'offensive', 'slur', 'insult', 'derogatory',
      'bigotry', 'sexist', 'homophobic', 'transphobic'
    ]
  }
};

/**
 * Analyzes a user message to determine if it contains inappropriate content
 */
function detectContentSafety(message: string): {
  isSafe: boolean;
  category?: string;
  confidence: number;
  detectedTerms: string[];
} {
  const normalizedMessage = message.toLowerCase().trim();
  const detectedTerms: string[] = [];
  let highestConfidence = 0;
  let detectedCategory: string | undefined;
  
  // Check each category of unsafe content
  for (const [category, patterns] of Object.entries(contentSafetyPatterns)) {
    // Check for direct keywords
    for (const keyword of patterns.keywords) {
      // Match whole words only
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(normalizedMessage)) {
        detectedTerms.push(keyword);
        // Higher confidence for direct keyword matches
        const termConfidence = 0.85;
        if (termConfidence > highestConfidence) {
          highestConfidence = termConfidence;
          detectedCategory = category;
        }
      }
    }
    
    // Check for contextual phrases if they exist for this category
    if (patterns.contextualPhrases) {
      for (const phrase of patterns.contextualPhrases) {
        if (normalizedMessage.includes(phrase.toLowerCase())) {
          detectedTerms.push(phrase);
          // Contextual phrases have slightly lower confidence than direct keywords
          const phraseConfidence = 0.75;
          if (phraseConfidence > highestConfidence) {
            highestConfidence = phraseConfidence;
            detectedCategory = category;
          }
        }
      }
    }
  }
  
  // Special case for image generation requests with inappropriate content
  if (normalizedMessage.includes('image') || normalizedMessage.includes('picture') || 
      normalizedMessage.includes('draw') || normalizedMessage.includes('generate')) {
    // Image generation requests with detected inappropriate terms get higher confidence
    if (detectedTerms.length > 0) {
      highestConfidence = Math.min(highestConfidence + 0.1, 0.95);
    }
    
    // Check for contextual image generation phrases that may indicate inappropriate content
    const suspiciousImagePhrases = [
      'without clothes', 'not wearing', 'with no', 'undressed', 'sexy', 
      'attractive woman', 'attractive man', 'hot girl', 'hot guy'
    ];
    
    for (const phrase of suspiciousImagePhrases) {
      if (normalizedMessage.includes(phrase)) {
        detectedTerms.push(phrase);
        // If suspicious phrase found in image generation context, increase confidence
        highestConfidence = Math.max(highestConfidence, 0.7);
        if (!detectedCategory) {
          detectedCategory = 'inappropriate';
        }
      }
    }
  }

  // Message is considered unsafe if we have detected terms and confidence is above threshold
  const isSafe = detectedTerms.length === 0 || highestConfidence < 0.6;
  
  return {
    isSafe,
    category: detectedCategory,
    confidence: highestConfidence,
    detectedTerms
  };
}

/**
 * Analyzes a user message to determine its likely intent
 */
export function classifyIntent(message: string): IntentClassification {
  // Normalize message for better matching
  const normalizedMessage = message.toLowerCase().trim();
  
  // First check for content safety
  const safetyCheck = detectContentSafety(normalizedMessage);
  
  // If content is unsafe, immediately classify as inappropriate content
  if (!safetyCheck.isSafe) {
    console.log(`[Intent Classifier] Unsafe content detected in message. Category: ${safetyCheck.category}, Confidence: ${safetyCheck.confidence.toFixed(2)}`);
    console.log(`[Intent Classifier] Detected terms: ${safetyCheck.detectedTerms.join(', ')}`);
    
    return {
      intentType: 'inappropriate-content',
      confidence: safetyCheck.confidence,
      relevantKeywords: safetyCheck.detectedTerms,
      suggestedMode: 'general', // Default to general mode for inappropriate content
      isSafeContent: false,
      contentCategory: safetyCheck.category
    };
  }
  
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
    if (intentType === 'unknown' || intentType === 'inappropriate-content') return; // Skip the unknown and inappropriate-content intents
    
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
  
  // Double-check image generation intent for inappropriate content
  if (bestMatch === 'image-generation') {
    // Perform a stricter content check for image generation
    const imageGenSafetyCheck = detectContentSafety(normalizedMessage);
    
    // For image generation, lower the threshold for inappropriate content detection
    if (imageGenSafetyCheck.confidence > 0.4 || imageGenSafetyCheck.detectedTerms.length > 0) {
      console.log(`[Intent Classifier] Potentially inappropriate image generation request detected. Confidence: ${imageGenSafetyCheck.confidence.toFixed(2)}`);
      console.log(`[Intent Classifier] Detected terms: ${imageGenSafetyCheck.detectedTerms.join(', ')}`);
      
      return {
        intentType: 'inappropriate-content',
        confidence: Math.max(imageGenSafetyCheck.confidence, 0.7), // Higher confidence for image-related inappropriate content
        relevantKeywords: [...relevantKeywords, ...imageGenSafetyCheck.detectedTerms],
        suggestedMode: 'general', // Default to general mode for inappropriate content
        isSafeContent: false,
        contentCategory: imageGenSafetyCheck.category || 'inappropriate'
      };
    }
  }
  
  // Log the classification for debugging
  console.log(`[Intent Classifier] Message classified as '${bestMatch}' (${highestScore.toFixed(2)}) with keywords: ${relevantKeywords.join(', ')}`);
  
  return {
    intentType: bestMatch,
    confidence: highestScore,
    relevantKeywords,
    suggestedMode,
    isSafeContent: true // Message passed safety check
  };
}

/**
 * Get a recommended response for inappropriate content requests
 */
export function getInappropriateContentResponse(
  originalIntent: IntentType, 
  category: string = 'inappropriate',
  currentMode: WAKTIAIMode = 'general'
): string {
  let response = '';
  
  // Base response
  const baseResponse = "I'm unable to assist with that request as it appears to contain inappropriate content. ";
  
  // Customize based on original intent
  if (originalIntent === 'image-generation') {
    response = baseResponse + "I can't generate images with adult, explicit, or inappropriate content. " +
      "Instead, I'd be happy to create appropriate images, help with other creative tasks, or assist with any other questions you have.";
  } else if (category === 'violence') {
    response = baseResponse + "I can't assist with violent or harmful content. " +
      "If you're interested in discussing conflict resolution or related topics in an academic context, I'm happy to help with that instead.";
  } else if (category === 'harassment') {
    response = baseResponse + "I can't assist with creating content that could be offensive or hurtful to others. " +
      "I'm here to help with positive and constructive requests.";
  } else {
    response = baseResponse + "I'm programmed to maintain appropriate content standards. " +
      "I'd be happy to help you with other tasks or answer other questions.";
  }
  
  // Add mode-specific suggestions
  if (currentMode === 'creative') {
    response += " I can help with creative writing, story ideas, artistic concepts, or brainstorming for projects - just make sure the content stays appropriate.";
  } else if (currentMode === 'productivity') {
    response += " If you're looking to boost your productivity, I can help with task management, scheduling, or workflow optimization instead.";
  } else if (currentMode === 'student') {
    response += " If you need help with studying or learning, I can assist with educational content, explanations, or study strategies.";
  }
  
  return response;
}
