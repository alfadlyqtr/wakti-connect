
import { ContentCategory } from './types';
import { inappropriateContentKeywords } from './keywords';

// Function to check specifically for inappropriate content
export function checkForInappropriateContent(message: string): {
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
