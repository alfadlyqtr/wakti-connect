
import { supabase } from '@/integrations/supabase/client';
import { classifyIntent, getInappropriateContentResponse } from './intentClassifier';
import { WAKTIAIMode } from '@/types/ai-assistant.types';

/**
 * Call the AI assistant with a prompt and return the response
 */
export const callAIAssistant = async (
  systemPrompt: string,
  userPrompt: string,
  context: string = '',
  userContext: string = '',
  currentMode: WAKTIAIMode = 'general'
): Promise<{ response?: string; error?: { message: string; isConnectionError?: boolean } }> => {
  try {
    console.log('[callAIAssistant] Starting request to AI assistant');
    
    // First, classify the intent of the user message
    const intentClassification = classifyIntent(userPrompt);
    console.log(`[callAIAssistant] Intent classified as: ${intentClassification.intentType} (confidence: ${intentClassification.confidence.toFixed(2)})`);
    
    // Check for inappropriate content first
    if (intentClassification.intentType === 'inappropriate-content') {
      console.log('[callAIAssistant] Detected inappropriate content, blocking request to AI service');
      const responseForInappropriateContent = getInappropriateContentResponse(
        'image-generation', // Assume the worst case - that this was for image generation
        intentClassification.contentCategory || 'inappropriate',
        currentMode
      );
      
      return { response: responseForInappropriateContent };
    }
    
    // Get current session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.error('[callAIAssistant] No authenticated session found');
      return {
        error: {
          message: 'Authentication required. Please sign in to use the AI assistant.',
          isConnectionError: false
        }
      };
    }
    
    console.log('[callAIAssistant] Authenticated session confirmed, calling AI service');
    
    // Enhanced system prompt with intent information
    let enhancedSystemPrompt = systemPrompt;
    if (intentClassification.confidence > 0.7) {
      // Add intent information to system prompt for better context
      enhancedSystemPrompt += `\n\nThe user's message has been classified as: ${intentClassification.intentType} with confidence ${intentClassification.confidence.toFixed(2)}. Relevant keywords: ${intentClassification.relevantKeywords.join(', ')}.`;
      
      // Mode-specific instructions
      if (intentClassification.suggestedMode && intentClassification.suggestedMode !== currentMode) {
        enhancedSystemPrompt += `\nNote: The user's request might be better suited for ${intentClassification.suggestedMode} mode, but they are currently in ${currentMode} mode. Adapt your response accordingly.`;
      }
    }
    
    // Call the AI assistant edge function with comprehensive error handling
    try {
      // Create a promise that rejects after 30 seconds
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), 30000)
      );

      // Race the actual request with the timeout
      const { data, error } = await Promise.race([
        supabase.functions.invoke('ai-assistant', {
          body: {
            system_prompt: enhancedSystemPrompt,
            user_prompt: userPrompt,
            message: userPrompt, // Adding alternate field format for compatibility
            context: context,
            userContext: userContext,
            includeTimestamp: true,
            intentClassification: JSON.stringify(intentClassification)
          }
        }),
        timeoutPromise
      ]) as { data?: any; error?: any };
      
      // Log for debugging
      console.log('[callAIAssistant] Response received:', {
        hasData: !!data,
        hasError: !!error,
        dataType: data ? typeof data : 'undefined',
      });
      
      if (error) {
        console.error('[callAIAssistant] Supabase function error:', error);
        return {
          error: {
            message: `AI service error: ${error.message || 'Unknown error'}`,
            isConnectionError: true
          }
        };
      }
      
      if (!data) {
        console.error('[callAIAssistant] No data returned from AI service');
        return {
          error: {
            message: 'No response received from AI service',
            isConnectionError: true
          }
        };
      }
      
      if (typeof data.response !== 'string') {
        console.error('[callAIAssistant] Invalid response format:', data);
        return {
          error: {
            message: 'Invalid response format from AI service',
            isConnectionError: false
          }
        };
      }
      
      return { response: data.response };
    } catch (functionError) {
      console.error('[callAIAssistant] Exception during function call:', functionError);
      
      const errorMessage = functionError.message || 'Unknown error calling AI service';
      const isConnectionRelated = 
        errorMessage.includes('Failed to fetch') || 
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('abort') ||
        errorMessage.includes('network');
      
      return {
        error: {
          message: errorMessage,
          isConnectionError: isConnectionRelated
        }
      };
    }
  } catch (error) {
    console.error('[callAIAssistant] Unexpected error:', error);
    return {
      error: {
        message: 'An unexpected error occurred. Please try again.',
        isConnectionError: false
      }
    };
  }
};
