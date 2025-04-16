
import { WAKTIAIMode } from '@/types/ai-assistant.types';

// Define the intent types for the classifier
export type IntentType = 
  | 'general-question'
  | 'task-creation'
  | 'image-generation' 
  | 'confirmation'
  | 'rejection'
  | 'inappropriate-content'
  | 'unknown';

// Define the content categories for inappropriate content
type ContentCategory = 
  | 'inappropriate'
  | 'explicit'
  | 'adult'
  | 'nudity'
  | 'violence'
  | 'hate'
  | 'harassment'
  | 'self-harm';

// Define the structure for intent classification results
export interface IntentClassification {
  intentType: IntentType;
  confidence: number;
  relevantKeywords: string[];
  isSafeContent?: boolean;
  contentCategory?: ContentCategory;
  suggestedMode?: WAKTIAIMode;
}

// Define a more specific type for keyword collections
interface KeywordCollection {
  keywords: string[];
}

interface KeywordCollectionWithPhrases extends KeywordCollection {
  contextualPhrases: string[];
}

// Keywords for different intent types
const generalQuestionKeywords: KeywordCollection = {
  keywords: [
    'what', 'how', 'why', 'when', 'where', 'who', 'explain', 'tell me about',
    'information', 'help me understand', 'describe', 'details', 'question',
    'meaning', 'define', 'difference', 'compare', 'example'
  ]
};

const taskCreationKeywords: KeywordCollectionWithPhrases = {
  keywords: [
    'create task', 'add task', 'new task', 'set reminder', 'remind me',
    'schedule', 'todo', 'to-do', 'to do', 'plan', 'appointment', 'meeting',
    'organize', 'set up', 'arrange', 'deadline', 'priority', 'objective',
    'goal', 'target', 'remember to', 'don\'t forget', 'important to'
  ],
  contextualPhrases: [
    'i need to', 'we need to', 'have to', 'must', 'should', 'tomorrow',
    'next week', 'in two days', 'on monday', 'at 5pm', 'by friday',
    'this weekend', 'monthly', 'yearly', 'annually', 'every day',
    'every morning', 'every evening', 'later today', 'in the morning'
  ]
};

const imageGenerationKeywords: KeywordCollectionWithPhrases = {
  keywords: [
    'generate image', 'create image', 'make image', 'draw', 'picture',
    'visual', 'illustration', 'artwork', 'photo', 'photograph', 'design',
    'graphic', 'generate a picture', 'create a picture', 'show me a',
    'visualize', 'render', 'create a visual', 'make a drawing', 'image of'
  ],
  contextualPhrases: [
    'can you show', 'could you generate', 'i\'d like to see', 'please create',
    'would you make', 'i want an image', 'create a scene', 'generate art of',
    'make a design', 'draw me a', 'illustrate', 'picture of', 'give me a visual',
    'show me what', 'can you draw', 'design a'
  ]
};

const confirmationKeywords: KeywordCollection = {
  keywords: [
    'yes', 'yeah', 'yep', 'correct', 'right', 'sure', 'ok', 'okay',
    'sounds good', 'perfect', 'great', 'absolutely', 'definitely',
    'confirm', 'approved', 'go ahead', 'proceed', 'do it', 'that\'s right',
    'that works', 'fine', 'good', 'indeed', 'agreed', 'affirmative'
  ]
};

const rejectionKeywords: KeywordCollection = {
  keywords: [
    'no', 'nope', 'incorrect', 'wrong', 'not right', 'cancel', 'stop',
    'don\'t', 'do not', 'negative', 'decline', 'reject', 'disagree',
    'not what i want', 'that\'s not correct', 'that\'s wrong', 'mistake',
    'error', 'not good', 'bad', 'terrible', 'abort', 'halt', 'cease'
  ]
};

// Inappropriate content detection
const inappropriateContentKeywords: KeywordCollectionWithPhrases = {
  keywords: [
    'nude', 'naked', 'sex', 'sexual', 'porn', 'pornographic', 'explicit',
    'adult content', 'erotic', 'obscene', 'nsfw', 'xxx', 'x-rated',
    'lewd', 'indecent', 'offensive', 'inappropriate', 'provocative',
    'violent', 'gore', 'blood', 'kill', 'murder', 'suicide', 'self-harm',
    'abuse', 'harmful', 'illegal', 'weapon', 'drug', 'terrorist'
  ],
  contextualPhrases: [
    'without clothes', 'no clothes', 'in the nude', 'removing clothes',
    'taking off', 'sexy', 'seductive', 'revealing', 'intimate parts',
    'private parts', 'adult image', 'graphic content', 'mature content',
    'violent scene', 'harmful content', 'dangerous', 'disturbing'
  ]
};

// Function to classify message intent
export function classifyIntent(message: string): IntentClassification {
  // Convert message to lowercase for case-insensitive matching
  const lowerMessage = message.toLowerCase();
  
  // Store confidence scores for each intent type
  const scores: Record<IntentType, number> = {
    'general-question': 0,
    'task-creation': 0,
    'image-generation': 0,
    'confirmation': 0,
    'rejection': 0,
    'inappropriate-content': 0,
    'unknown': 0.1 // Default minimal score
  };
  
  // Store matched keywords for explaining the classification
  const matchedKeywords: Record<IntentType, string[]> = {
    'general-question': [],
    'task-creation': [],
    'image-generation': [],
    'confirmation': [],
    'rejection': [],
    'inappropriate-content': [],
    'unknown': []
  };
  
  // Check for inappropriate content first (safety layer)
  const safetyCheckResult = checkForInappropriateContent(lowerMessage);
  if (safetyCheckResult.isInappropriate) {
    return {
      intentType: 'inappropriate-content',
      confidence: safetyCheckResult.confidence,
      relevantKeywords: safetyCheckResult.matchedTerms,
      isSafeContent: false,
      contentCategory: safetyCheckResult.category
    };
  }
  
  // Check for general question keywords
  for (const keyword of generalQuestionKeywords.keywords) {
    if (lowerMessage.includes(keyword)) {
      scores['general-question'] += 0.15;
      matchedKeywords['general-question'].push(keyword);
    }
  }
  
  // Check for task creation intent
  for (const keyword of taskCreationKeywords.keywords) {
    if (lowerMessage.includes(keyword)) {
      scores['task-creation'] += 0.2;
      matchedKeywords['task-creation'].push(keyword);
    }
  }
  
  // Also check for contextual phrases for task creation
  for (const phrase of taskCreationKeywords.contextualPhrases) {
    if (lowerMessage.includes(phrase)) {
      scores['task-creation'] += 0.1;
      matchedKeywords['task-creation'].push(phrase);
    }
  }
  
  // Check for image generation intent
  for (const keyword of imageGenerationKeywords.keywords) {
    if (lowerMessage.includes(keyword)) {
      scores['image-generation'] += 0.25;
      matchedKeywords['image-generation'].push(keyword);
    }
  }
  
  // Also check for contextual phrases for image generation
  for (const phrase of imageGenerationKeywords.contextualPhrases) {
    if (lowerMessage.includes(phrase)) {
      scores['image-generation'] += 0.15;
      matchedKeywords['image-generation'].push(phrase);
    }
  }
  
  // Check for confirmation intent
  for (const keyword of confirmationKeywords.keywords) {
    // Use word boundary check to avoid partial matches
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(lowerMessage)) {
      scores['confirmation'] += 0.3;
      matchedKeywords['confirmation'].push(keyword);
    }
  }
  
  // Check for rejection intent
  for (const keyword of rejectionKeywords.keywords) {
    // Use word boundary check to avoid partial matches
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(lowerMessage)) {
      scores['rejection'] += 0.3;
      matchedKeywords['rejection'].push(keyword);
    }
  }
  
  // Find the intent with the highest confidence score
  let highestConfidenceIntent: IntentType = 'unknown';
  let highestConfidence = scores['unknown'];
  
  for (const intent of Object.keys(scores) as IntentType[]) {
    if (scores[intent] > highestConfidence) {
      highestConfidence = scores[intent];
      highestConfidenceIntent = intent;
    }
  }
  
  // For very short messages, adjust confidence
  if (message.length < 5) {
    highestConfidence = Math.min(highestConfidence, 0.5);
  }
  
  // Cap confidence at 0.95
  highestConfidence = Math.min(highestConfidence, 0.95);
  
  // If no significant match found, default to general question or unknown
  if (highestConfidence < 0.2) {
    // Very short message could be a confirmation or rejection
    if (message.length < 10) {
      if (scores['confirmation'] > 0) {
        highestConfidenceIntent = 'confirmation';
        highestConfidence = 0.7;
      } else if (scores['rejection'] > 0) {
        highestConfidenceIntent = 'rejection';
        highestConfidence = 0.7;
      } else {
        highestConfidenceIntent = 'unknown';
        highestConfidence = 0.3;
      }
    } else {
      // Default to general question for longer messages with no clear intent
      highestConfidenceIntent = 'general-question';
      highestConfidence = 0.4;
    }
  }
  
  // Determine a suggested AI mode based on the intent
  let suggestedMode: WAKTIAIMode | undefined;
  
  if (highestConfidenceIntent === 'task-creation') {
    suggestedMode = 'productivity';
  } else if (highestConfidenceIntent === 'image-generation') {
    suggestedMode = 'creative';
  } else if (highestConfidenceIntent === 'general-question' && 
             (lowerMessage.includes('study') || 
              lowerMessage.includes('learn') || 
              lowerMessage.includes('homework') || 
              lowerMessage.includes('education'))) {
    suggestedMode = 'student';
  }
  
  return {
    intentType: highestConfidenceIntent,
    confidence: highestConfidence,
    relevantKeywords: matchedKeywords[highestConfidenceIntent],
    isSafeContent: true,
    suggestedMode
  };
}

// Function to check specifically for inappropriate content
function checkForInappropriateContent(message: string): {
  isInappropriate: boolean;
  confidence: number;
  matchedTerms: string[];
  category: ContentCategory;
} {
  const matchedTerms: string[] = [];
  let confidence = 0;
  let category: ContentCategory = 'inappropriate';
  
  // Check explicit keywords
  for (const keyword of inappropriateContentKeywords.keywords) {
    if (message.includes(keyword)) {
      matchedTerms.push(keyword);
      confidence += 0.25;
      
      // Categorize the inappropriate content
      if (['nude', 'naked', 'sex', 'sexual', 'porn', 'erotic', 'xxx'].includes(keyword)) {
        category = 'adult';
      } else if (['violent', 'gore', 'blood', 'kill', 'murder'].includes(keyword)) {
        category = 'violence';
      } else if (['hate', 'racist', 'sexist', 'offensive'].includes(keyword)) {
        category = 'hate';
      } else if (['suicide', 'self-harm'].includes(keyword)) {
        category = 'self-harm';
      } else if (['abuse', 'harassment'].includes(keyword)) {
        category = 'harassment';
      }
    }
  }
  
  // Check contextual phrases
  for (const phrase of inappropriateContentKeywords.contextualPhrases) {
    if (message.includes(phrase)) {
      matchedTerms.push(phrase);
      confidence += 0.15;
    }
  }
  
  // Special check for potential sexual content in image generation
  if (message.includes('image') || message.includes('picture') || message.includes('draw')) {
    // Additional terms that are concerning in the context of image generation
    const riskyImagePhrases = [
      'woman', 'man', 'person', 'body', 'attractive', 'hot', 'bikini', 
      'underwear', 'lingerie', 'swimsuit', 'bathing suit'
    ];
    
    let riskyImageTerms = 0;
    for (const term of riskyImagePhrases) {
      if (message.includes(term)) {
        riskyImageTerms++;
      }
    }
    
    // If multiple risky terms present in an image request, increase confidence
    if (riskyImageTerms >= 2) {
      confidence += 0.2;
      matchedTerms.push('risky image generation request');
    }
  }
  
  // Cap confidence at 0.95
  confidence = Math.min(confidence, 0.95);
  
  return {
    isInappropriate: confidence > 0.25,
    confidence,
    matchedTerms,
    category
  };
}

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
    'self-harm': "I cannot provide content related to self-harm. If you're in crisis, please contact a mental health professional."
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
