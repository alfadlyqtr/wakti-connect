
import { supabase } from '@/integrations/supabase/client';

/**
 * Call the AI assistant with a prompt and return the response
 */
export const callAIAssistant = async (
  systemPrompt: string,
  userPrompt: string,
  context: string = '',
  userContext: string = ''
): Promise<{ response?: string; error?: { message: string; isConnectionError?: boolean } }> => {
  try {
    console.log('[callAIAssistant] Starting request to AI assistant');
    
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
    
    // Call the AI assistant edge function with comprehensive error handling
    try {
      // Use AbortController for timeout handling instead of options
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout
      
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          system_prompt: systemPrompt,
          user_prompt: userPrompt,
          message: userPrompt, // Adding alternate field format for compatibility
          context: context,
          userContext: userContext,
          includeTimestamp: true
        },
        signal: controller.signal // Use AbortController signal for timeout
      });
      
      // Clear the timeout
      clearTimeout(timeoutId);
      
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
