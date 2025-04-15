
import { useState, useEffect, useCallback } from 'react';
import { globalChatMemory } from '@/services/GlobalChatMemory';
import { ChatMemoryMessage } from '@/components/ai/personality-switcher/types';
import { useAIPersonality } from '@/components/ai/personality-switcher/AIPersonalityContext';
import { callAIAssistant } from '@/hooks/ai/utils/callAIAssistant';
import { useAuth } from '@/hooks/auth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from '@/hooks/use-toast';

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
  
  // Send message function
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;
    
    setIsLoading(true);
    
    try {
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
      
      // Call AI assistant
      const { response, error } = await callAIAssistant(
        systemMessage,
        content,
        JSON.stringify(recentMessages)
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
        // Add AI response to memory
        globalChatMemory.addMessage({
          role: 'assistant',
          content: response,
          mode: currentMode
        });
      }
    } catch (error) {
      console.error('[useGlobalChat] Error sending message:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, currentMode, currentPersonality]);
  
  // Clear all messages
  const clearMessages = useCallback(() => {
    globalChatMemory.clearMessages();
  }, []);
  
  // Check if user can use AI based on their account type
  // FIX: Only restrict if profile is loaded and account_type is 'free'
  const canUseAI = !user ? false : isProfileLoading ? true : profile?.account_type !== 'free';
  
  return {
    messages,
    sendMessage,
    isLoading,
    clearMessages,
    canUseAI,
    sessionId: globalChatMemory.getSessionId()
  };
};
