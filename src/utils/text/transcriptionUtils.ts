
/**
 * Utilities for improving speech transcription results
 */

/**
 * Improves transcription accuracy with common post-processing techniques
 * @param text The raw transcription text
 * @param language The language code (e.g., 'en', 'ar', 'auto')
 * @returns Improved transcription text
 */
export const improveTranscriptionAccuracy = (text: string, language: string): string => {
  if (!text) return '';
  
  // If auto-detect, try to determine language
  if (language === 'auto') {
    // Simple language detection - more sophisticated logic could be added
    const hasArabicChars = /[\u0600-\u06FF]/.test(text);
    language = hasArabicChars ? 'ar' : 'en';
  }
  
  if (language === 'en') {
    // English improvements
    // Capitalize first letter of sentences
    let improved = text.replace(/(\.\s+|^\s*)([a-z])/g, (match, p1, p2) => {
      return p1 + p2.toUpperCase();
    });
    
    // Fix common transcription errors
    const corrections: Record<string, string> = {
      'i think': 'I think',
      'i am': 'I am',
      'i\'m': 'I\'m',
      'i\'ll': 'I\'ll',
      'i\'ve': 'I\'ve',
      'i\'d': 'I\'d',
      'ok ': 'OK ',
      'okay ': 'OK ',
      'gonna ': 'going to ',
      'wanna ': 'want to ',
      'gotta ': 'got to ',
      'kinda ': 'kind of ',
      'sorta ': 'sort of ',
      'lemme ': 'let me ',
      'gimme ': 'give me ',
    };
    
    // Apply corrections
    Object.entries(corrections).forEach(([incorrect, correct]) => {
      improved = improved.replace(new RegExp(`\\b${incorrect}\\b`, 'gi'), correct);
    });
    
    // Add periods to sentences that might be missing them
    improved = improved.replace(/([a-z])\s+([A-Z])/g, '$1. $2');
    
    // Clean up multiple spaces
    improved = improved.replace(/\s{2,}/g, ' ').trim();
    
    return improved;
  } else if (language === 'ar') {
    // Arabic improvements
    // For Arabic text, we need different processing logic
    
    // 1. Fix common Arabic transcription errors (simplified example)
    const arabicCorrections: Record<string, string> = {
      // Add common Arabic transcription corrections here
      // This is a placeholder for actual Arabic language corrections
    };
    
    let improved = text;
    
    Object.entries(arabicCorrections).forEach(([incorrect, correct]) => {
      improved = improved.replace(new RegExp(incorrect, 'g'), correct);
    });
    
    // 2. Fix spacing issues that are common in Arabic transcriptions
    improved = improved.replace(/\s{2,}/g, ' ').trim();
    
    return improved;
  }
  
  // Default return for other languages
  return text;
};

/**
 * Detect location information from transcribed text
 * @param text The transcribed text to analyze
 * @returns Detected location or null if none found
 */
export const detectLocationFromText = (text: string): string | null => {
  if (!text) return null;
  
  // Check if we're processing Arabic text
  const isArabicText = /[\u0600-\u06FF]/.test(text);
  
  if (isArabicText) {
    // Arabic location patterns
    const arabicLocationPatterns = [
      // Simplified Arabic location patterns - in a real implementation these would be more comprehensive
      /(?:الاجتماع|موقع|مكان).*?(?:في|ب).*?([ء-ي\s]+)/i,
      /(?:القاعة|غرفة|قاعة).*?([ء-ي\s]+\d*)/i,
    ];
    
    for (const pattern of arabicLocationPatterns) {
      const matches = text.match(pattern);
      if (matches && matches[1]) {
        return matches[1].trim();
      }
    }
  } else {
    // English location patterns
    const locationPatterns = [
      // Meeting at/in [Location]
      /(?:meeting|located|held|happening|taking place|will be|scheduled)\s+(?:at|in)\s+(?:the\s+)?([A-Za-z0-9\s,]+(?:Building|Office|Center|Room|Hall|Tower|Plaza|Street|Avenue|Road|Boulevard|Place|Square|Park|Campus|Floor|Suite|Theater|Arena|Stadium|Hotel|Conference|Center|Venue))/gi,
      
      // Located/held at [Location]
      /(?:located|held)\s+(?:at|in)\s+(?:the\s+)?([A-Za-z0-9\s,]+(?:Building|Office|Center|Room|Hall|Tower|Plaza))/gi,
      
      // At [Street Address]
      /(?:at|on)\s+(\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Place|Pl|Court|Ct|Way|Circle|Cir|Terrace|Ter))/gi,
      
      // Address is [Location]
      /(?:location|venue|place|address)(?:\s+is)?(?:\s+at)?[:\s]+([A-Za-z0-9\s,\.#-]+)/i,
      
      // Meeting/event in [City]
      /(?:in|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+City)?),?\s+([A-Z]{2}|[A-Za-z]+)\b/g,
      
      // Mentions of room numbers
      /(?:room|rm)\s+(\d+[A-Za-z0-9-]*)/gi,
      
      // Conference rooms often mentioned
      /((?:[A-Z][a-z]+\s+){1,3}(?:Conference|Meeting|Board)\s+Room)/g,
    ];

    for (const pattern of locationPatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        // Extract the location part from the match
        const locationMatch = pattern.exec(text);
        if (locationMatch && locationMatch[1]) {
          return locationMatch[1].trim();
        }
        // Fall back to the whole match with some cleanup
        return matches[0]
          .replace(/(?:meeting|located|held|happening|taking place|will be|scheduled|at|in)\s+(?:the\s+)?/i, '')
          .trim();
      }
    }

    // Look for named locations with capital letters (potential proper nouns)
    const properNounMatch = text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\b/g);
    if (properNounMatch) {
      // Filter out common non-location proper nouns
      const commonNonLocations = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      
      const potentialLocations = properNounMatch.filter(name => 
        !commonNonLocations.includes(name) && name.length > 3);
      
      if (potentialLocations.length > 0) {
        // Try to find locations that appear before or after location-related words
        const locationContexts = ['at', 'in', 'near', 'location', 'venue', 'place', 'meet', 'meeting', 'office'];
        
        for (const location of potentialLocations) {
          const contextCheck = new RegExp(`(${locationContexts.join('|')})\\s+${location}|${location}\\s+(${locationContexts.join('|')})`, 'i');
          if (text.match(contextCheck)) {
            return location;
          }
        }
      }
    }
  }

  return null;
};

/**
 * Extracts potential attendees from meeting transcript
 * @param text The transcribed text to analyze
 * @returns Array of detected attendee names or null if none found
 */
export const detectAttendeesFromText = (text: string): string[] | null => {
  if (!text) return null;
  
  const attendees: string[] = [];
  
  // Check if we're processing Arabic text
  const isArabicText = /[\u0600-\u06FF]/.test(text);
  
  if (isArabicText) {
    // Arabic attendee patterns (simplified)
    const arabicAttendeePatterns = [
      /(?:حضر|الحاضرون|المشاركون).*?(?:هم|:)([ء-ي\s,،]+)/i,
    ];
    
    for (const pattern of arabicAttendeePatterns) {
      const matches = text.match(pattern);
      if (matches && matches[1]) {
        // Split by commas or 'and' in Arabic
        const names = matches[1].split(/[,،]\s*|(?:\s+و\s+)/);
        attendees.push(...names.map(name => name.trim()).filter(name => name.length > 0));
      }
    }
  } else {
    // English attendee patterns
    const attendeePatterns = [
      // Common meeting starter language
      /(?:attendees|participants|attendants|present|joined)(?:\s+(?:were|included|are|:))([^\.]+)/i,
      // Introductions
      /(?:introductions|introducing)(?:\s+(?:were|from|by|:))([^\.]+)/i,
      // List of people often at start
      /^(?:present|attending)(?:\s+(?:were|:))([^\.]+)/i,
    ];

    for (const pattern of attendeePatterns) {
      const matches = text.match(pattern);
      if (matches && matches[1]) {
        // Split by commas or 'and'
        const names = matches[1].split(/[,]\s*|(?:\s+and\s+)/);
        attendees.push(...names.map(name => name.trim()).filter(name => name.length > 0));
      }
    }
    
    // Look for phrases like "X joined the meeting"
    const joinPatterns = [
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\s+(?:joined|attended|participated in)\s+(?:the|this|our)\s+(?:meeting|call|discussion)/gi,
    ];
    
    for (const pattern of joinPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        if (match[1]) {
          attendees.push(match[1].trim());
        }
      }
    }
  }
  
  return attendees.length > 0 ? [...new Set(attendees)] : null; // Remove duplicates
};
