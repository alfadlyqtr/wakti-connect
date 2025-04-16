
import { useState, useEffect, useCallback } from 'react';
import { globalChatMemory } from '@/services/GlobalChatMemory';
import { ChatMemoryMessage } from '@/components/ai/personality-switcher/types';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';
import { callAIAssistant } from '@/hooks/ai/utils/callAIAssistant';
import { useAuth } from '@/hooks/auth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  
  // Send message function with improved error handling
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;
    
    setIsLoading(true);
    
    try {
      console.log('[useGlobalChat] Sending message:', content.substring(0, 30) + (content.length > 30 ? '...' : ''));
      
      // Add user message to memory
      globalChatMemory.addMessage({
        role: 'user',
        content,
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
      } else {
        userContext = 'Unknown User';
      }
      
      console.log('[useGlobalChat] Calling AI assistant with personality:', currentMode);
      
      // Call AI assistant with additional debugging
      try {
        const { response, error } = await callAIAssistant(
          systemMessage,
          content,
          JSON.stringify(recentMessages),
          userContext,
          currentMode // Pass the current mode to help with content moderation
        );
        
        if (error) {
          console.error('[useGlobalChat] AI assistant error:', error);
          toast({
            title: "Error",
            description: error.message || "Failed to get AI response",
            variant: "destructive",
          });
          return;
        }
        
        if (response) {
          console.log('[useGlobalChat] Received AI response successfully');
          
          // Add AI response to memory
          globalChatMemory.addMessage({
            role: 'assistant',
            content: response,
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
  }, [isLoading, messages, currentMode, currentPersonality, profile]);
  
  // Clear all messages
  const clearMessages = useCallback(() => {
    globalChatMemory.clearMessages();
  }, []);
  
  // Check if user can use AI based on their account type
  // Only restrict if profile is loaded and account_type is 'free'
  const canUseAI = !isProfileLoading && profile?.account_type !== 'free';
  
  return {
    messages,
    sendMessage,
    isLoading,
    clearMessages,
    canUseAI,
    sessionId: globalChatMemory.getSessionId()
  };
};
