
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
export type ContentCategory = 
  | 'inappropriate'
  | 'explicit'
  | 'adult'
  | 'nudity'
  | 'violence'
  | 'hate'
  | 'harassment'
  | 'self-harm'
  | 'sexual';  // Adding 'sexual' as a valid category type

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
export interface KeywordCollection {
  keywords: string[];
}

export interface KeywordCollectionWithPhrases extends KeywordCollection {
  contextualPhrases: string[];
}
