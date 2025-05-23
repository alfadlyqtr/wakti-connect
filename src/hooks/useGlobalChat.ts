import { useState, useEffect, useCallback } from 'react';
import { globalChatMemory } from '@/services/GlobalChatMemory';
import { ChatMemoryMessage } from '@/components/ai/personality-switcher/types';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';
import { callAIAssistant } from '@/hooks/ai/utils/callAIAssistant';
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useProfile } from '@/hooks/useProfile';
import { toast } from '@/components/ui/use-toast';

export const useGlobalChat = () => {
  const [messages, setMessages] = useState<ChatMemoryMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentMode, currentPersonality } = useAIPersonality();
  const { user } = useAuth();
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
      const processedContent = content.replace(imagePattern, '');
      return {
        content: processedContent.trim(),
        imageUrl: match[1].trim() 
      };
    }
    
    return { content, imageUrl: null };
  };
  
  // Always allow AI access - no auth checks
  const canUseAI = useCallback(() => {
    return true; // Always return true - no auth checking
  }, []);
  
  // Send message function with improved error handling
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;
    
    setIsLoading(true);
    
    try {
      console.log('[useGlobalChat] Sending message:', content.substring(0, 30) + (content.length > 30 ? '...' : ''));
      
      // Add user message to memory - ensure all properties match ChatMemoryMessage type
      globalChatMemory.addMessage({
        role: 'user',
        content,
        timestamp: new Date(),
        mode: currentMode
      });
      
      // Prepare system message with current personality
      const systemMessage = currentPersonality.systemPrompt;
      
      // Get up to 10 recent messages for context
      const recentMessages = messages.slice(-10);
      
      // Get user context for better personalization
      let userContext = '';
      if (profile) {
        userContext = `User: ${profile.full_name || 'Unknown'}, Account Type: ${profile.account_type || 'free'}`;
      } else if (user) {
        // Use metadata as fallback if profile not loaded
        userContext = `User: ${user.user_metadata?.full_name || 'Unknown'}, Account Type: ${user.user_metadata?.account_type || 'free'}`;
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
          currentMode
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
          
          // Add AI response to memory - ensure all properties match ChatMemoryMessage type
          globalChatMemory.addMessage({
            role: 'assistant',
            content: processedContent,
            timestamp: new Date(),
            imageUrl: imageUrl || generatedImage,
            mode: currentMode
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
  }, [isLoading, messages, currentMode, currentPersonality, profile, user]);
  
  // Clear all messages
  const clearMessages = useCallback(() => {
    globalChatMemory.clearMessages();
  }, []);
  
  return {
    messages,
    sendMessage,
    isLoading,
    clearMessages,
    canUseAI: true,
    sessionId: globalChatMemory.getSessionId()
  };
};
