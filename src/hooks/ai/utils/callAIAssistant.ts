
import { supabase } from '@/integrations/supabase/client';
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
    // Only generate images directly in creative mode or if explicitly requesting image generation
    const isImageGenerationIntent = intentClassification.intentType === 'image-generation' && intentClassification.confidence > 0.35;
    const isCreativeMode = currentMode === 'creative';
    const containsImageKeywords = userPrompt.toLowerCase().includes('image') || 
                                  userPrompt.toLowerCase().includes('picture') || 
                                  userPrompt.toLowerCase().includes('photo') ||
                                  userPrompt.toLowerCase().includes('generate');
    
    if (isImageGenerationIntent || (isCreativeMode && containsImageKeywords)) {
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
          const providerInfo = imageResult.provider ? ` using ${imageResult.provider}` : '';
          const response = `I've generated an image based on your request: "${userPrompt}"${providerInfo}.

[IMAGE_GENERATED]${imageResult.imageUrl}[/IMAGE_GENERATED]

You can ask me to generate another image or help with something else!`;
          
          return { 
            response: response,
            generatedImage: imageResult.imageUrl
          };
        } else {
          // If image generation failed, inform the user and proceed with text response
          console.error('[callAIAssistant] Image generation failed:', imageResult.error);
          
          // Return error message about image generation failure
          return {
            response: `I tried to generate an image based on your request, but encountered a problem: ${imageResult.error || 'The image generation service is currently unavailable.'}
            
Would you like to try again with a different prompt? Or I can help you with something else.`
          };
        }
      } catch (imageError) {
        console.error('[callAIAssistant] Error in image generation:', imageError);
        
        // Return error message about image generation failure
        return {
          response: `I tried to generate an image based on your request, but encountered a technical problem.
          
Would you like to try again with a different prompt? Or I can help you with something else.`
        };
      }
    }
    
    // Call the AI assistant edge function for non-image requests
    try {
      // Create a promise that rejects after 30 seconds for timeout handling
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), 30000)
      );
      
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
