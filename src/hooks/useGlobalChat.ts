
import { useState, useEffect, useCallback } from 'react';
import { globalChatMemory } from '@/services/GlobalChatMemory';
import { ChatMemoryMessage } from '@/components/ai/personality-switcher/types';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';
import { callAIAssistant } from '@/hooks/ai/utils/callAIAssistant';
import { useAuth } from '@/hooks/auth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export const useGlobalChat = () => {
  const [messages, setMessages] = useState<ChatMemoryMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentMode, currentPersonality } = useAIPersonality();
  const { user, isAuthenticated } = useAuth();
  const { profile, isLoading: isProfileLoading } = useProfile(user?.id);
  
  // Subscribe to global chat memory
  useEffect(() => {
    const unsubscribe = globalChatMemory.subscribe(updatedMessages => {
      setMessages(updatedMessages);
    });
    
    return unsubscribe;
  }, []);
  
  // Process for embedded images in AI responses
  const processMessageWithImages = (content: string): { content: string, imageUrl: string | null } => {
    const imagePattern = /\[IMAGE_GENERATED\](.*?)\[\/IMAGE_GENERATED\]/;
    const match = content.match(imagePattern);
    
    if (match && match[1]) {
      // Remove the image tag from the content
      const processedContent = content.replace(imagePattern, '');
      return {
        content: processedContent.trim(),
        imageUrl: match[1].trim() 
      };
    }
    
    return { content, imageUrl: null };
  };
  
  // Simplified check if user has necessary account type for AI
  const userCanUseAI = useCallback(() => {
    // If not authenticated, can't use AI
    if (!isAuthenticated) {
      return false;
    }
    
    // First check user metadata - single source of truth
    const accountTypeFromMetadata = user?.user_metadata?.account_type;
    if (accountTypeFromMetadata === 'business' || accountTypeFromMetadata === 'individual') {
      return true;
    }
    
    // If metadata doesn't have the info, check profile as fallback
    if (!isProfileLoading && profile) {
      if (profile.account_type === 'business' || profile.account_type === 'individual') {
        return true;
      }
    }
    
    // Default to false if we can't confirm access
    return false;
  }, [isAuthenticated, isProfileLoading, profile, user]);
  
  // Send message function with improved error handling
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;
    
    // Check if user can use AI - simplified check
    const canUseAI = userCanUseAI();
    
    if (canUseAI === false) {
      toast({
        title: "Feature not available",
        description: "AI Assistant is only available for Business and Individual accounts.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('[useGlobalChat] Sending message:', content.substring(0, 30) + (content.length > 30 ? '...' : ''));
      
      // Add user message to memory
      globalChatMemory.addMessage({
        role: 'user',
        content,
        mode: currentMode,
        timestamp: new Date()
      });
      
      // Prepare system message with current personality
      const systemMessage = currentPersonality.systemPrompt;
      
      // Get up to 10 recent messages for context
      const recentMessages = messages.slice(-10);
      
      // Get user context for better personalization
      let userContext = '';
      if (profile) {
        userContext = `User: ${profile.full_name || 'Unknown'}, Account Type: ${profile.account_type || 'free'}`;
      } else {
        userContext = 'Unknown User';
      }
      
      console.log('[useGlobalChat] Calling AI assistant with personality:', currentMode);
      
      // Call AI assistant with additional debugging
      try {
        const { response, generatedImage, error } = await callAIAssistant(
          systemMessage,
          content,
          JSON.stringify(recentMessages),
          userContext,
          currentMode // Pass the current mode to help with content moderation
        );
        
        if (error) {
          console.error('[useGlobalChat] AI assistant error:', error);
          
          // Handle different types of errors differently
          if (error.isConnectionError) {
            toast({
              title: "Connection Error",
              description: "Could not connect to AI service. Please check your internet connection and try again.",
              variant: "destructive",
            });
          } else if (error.message.includes("only available for Business")) {
            toast({
              title: "Access Restricted",
              description: "AI Assistant is only available for Business and Individual accounts.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error",
              description: error.message || "Failed to get AI response",
              variant: "destructive",
            });
          }
          return;
        }
        
        if (response) {
          console.log('[useGlobalChat] Received AI response successfully');
          
          // Process response for embedded images
          const { content: processedContent, imageUrl } = processMessageWithImages(response);
          
          // Add AI response to memory
          globalChatMemory.addMessage({
            role: 'assistant',
            content: processedContent,
            mode: currentMode,
            imageUrl: imageUrl || generatedImage, // Use either embedded image or separately returned image
            timestamp: new Date()
          });
        } else {
          console.error('[useGlobalChat] Empty response from AI assistant');
          toast({
            title: "Error",
            description: "Received empty response from AI",
            variant: "destructive",
          });
        }
      } catch (callError) {
        console.error('[useGlobalChat] Exception during AI assistant call:', callError);
        toast({
          title: "Communication Error",
          description: "Failed to communicate with AI service. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('[useGlobalChat] Unexpected error sending message:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, currentMode, currentPersonality, profile, userCanUseAI]);
  
  // Clear all messages
  const clearMessages = useCallback(() => {
    globalChatMemory.clearMessages();
  }, []);
  
  return {
    messages,
    sendMessage,
    isLoading,
    clearMessages,
    canUseAI: userCanUseAI(),
    sessionId: globalChatMemory.getSessionId()
  };
};
