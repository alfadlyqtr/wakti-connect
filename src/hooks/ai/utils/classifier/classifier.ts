
import { WAKTIAIMode } from '@/types/ai-assistant.types';
import { 
  IntentType, 
  IntentClassification, 
  KeywordCollection,
  KeywordCollectionWithPhrases
} from './types';
import { 
  generalQuestionKeywords, 
  taskCreationKeywords,
  imageGenerationKeywords,
  confirmationKeywords,
  rejectionKeywords
} from './keywords';
import { checkForInappropriateContent } from './safetyChecker';

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
