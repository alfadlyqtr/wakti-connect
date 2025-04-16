
import { supabase } from '@/lib/supabase';
import { classifyIntent, getInappropriateContentResponse } from './classifier';
import { WAKTIAIMode } from '@/types/ai-assistant.types';
import { handleImageGeneration } from './imageHandling';
import { toast } from '@/components/ui/use-toast';

/**
 * Call the AI assistant with a prompt and return the response
 */
export const callAIAssistant = async (
  systemPrompt: string,
  userPrompt: string,
  context: string = '',
  userContext: string = '',
  currentMode: WAKTIAIMode = 'general'
): Promise<{ response?: string; generatedImage?: string; error?: { message: string; isConnectionError?: boolean } }> => {
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
    
    // Handle image generation if the intent is image-generation with high confidence
    if (intentClassification.intentType === 'image-generation' && intentClassification.confidence > 0.4) {
      console.log('[callAIAssistant] Detected image generation intent, processing request');
      
      try {
        toast({
          title: "Generating Image",
          description: "Starting image generation based on your request...",
          duration: 3000,
        });
        
        const imageResult = await handleImageGeneration(userPrompt);
        
        if (imageResult.success) {
          // Return both the image URL and a confirmation message
          const response = `I've generated an image based on your request: "${userPrompt}".

[IMAGE_GENERATED]${imageResult.imageUrl}[/IMAGE_GENERATED]

You can ask me to generate another image or help with something else!`;
          
          return { 
            response: response,
            generatedImage: imageResult.imageUrl
          };
        } else {
          // If image generation failed, inform the user and proceed with text response
          console.error('[callAIAssistant] Image generation failed:', imageResult.error);
          
          // Continue with text-based response below, don't return here
        }
      } catch (imageError) {
        console.error('[callAIAssistant] Error in image generation:', imageError);
        // Continue with text-based response below, don't return here
      }
    }
    
    // Get fresh session and ensure we have a valid token for the request
    // IMPORTANT: This is the only authentication check we need
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('[callAIAssistant] Error getting session:', sessionError);
      return {
        error: {
          message: 'Authentication required. Please refresh and sign in again.',
          isConnectionError: false
        }
      };
    }
    
    if (!sessionData.session) {
      console.error('[callAIAssistant] No session found');
      return {
        error: {
          message: 'Authentication required. Please sign in to use the AI assistant.',
          isConnectionError: false
        }
      };
    }
    
    // Log the session token (first 10 chars) for debugging
    const token = sessionData.session.access_token;
    console.log('[callAIAssistant] Got session token:', token.substring(0, 10) + '...');
    
    // ADDED: Additional session verification log
    console.log('[callAIAssistant] User authenticated:', sessionData.session.user.id);
    
    // Create a promise that rejects after 30 seconds for timeout handling
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timed out')), 30000)
    );
    
    // Call the AI assistant edge function with comprehensive error handling
    try {
      // Race the actual request with the timeout
      const { data, error } = await Promise.race([
        supabase.functions.invoke('ai-assistant', {
          body: {
            system_prompt: systemPrompt,
            user_prompt: userPrompt,
            message: userPrompt, // Adding alternate field format for compatibility
            context: context,
            userContext: userContext,
            includeTimestamp: true,
            intentClassification: JSON.stringify(intentClassification)
          },
          headers: {
            Authorization: `Bearer ${token}`,
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
        
        // Special handling for authentication errors
        if (error.message?.includes('JWT') || error.message?.includes('auth') || error.message?.includes('token')) {
          console.error('[callAIAssistant] Authentication error detected, attempting session refresh');
          
          // Try to refresh the session
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.error('[callAIAssistant] Session refresh failed:', refreshError);
            return {
              error: {
                message: 'Your session has expired. Please sign in again.',
                isConnectionError: false
              }
            };
          } else {
            return {
              error: {
                message: 'Session refreshed. Please try your request again.',
                isConnectionError: false
              }
            };
          }
        }
        
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
      
      // Check if this is an auth error
      if (functionError.message?.includes('JWT') || 
          functionError.message?.includes('auth') || 
          functionError.message?.includes('token')) {
        console.error('[callAIAssistant] Auth error detected, attempting session refresh');
        try {
          // Try to refresh the session
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.error('[callAIAssistant] Session refresh failed:', refreshError);
          } else {
            console.log('[callAIAssistant] Session refreshed successfully');
            return {
              error: {
                message: 'Session refreshed. Please try your request again.',
                isConnectionError: false
              }
            };
          }
        } catch (refreshError) {
          console.error('[callAIAssistant] Error refreshing session:', refreshError);
        }
      }
      
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
