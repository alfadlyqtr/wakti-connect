
// This file is kept for backwards compatibility
// It re-exports functionality from the classifier directory
export { 
  classifyIntent, 
  getInappropriateContentResponse 
} from './classifier';

export type { 
  IntentType, 
  ContentCategory, 
  IntentClassification 
} from './classifier/types';
