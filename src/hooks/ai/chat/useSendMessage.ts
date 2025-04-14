
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { AIMessage } from '@/types/ai-assistant.types';
import { SendMessageResult, UseChatOptions } from './types';

export const useSendMessage = (
  options: UseChatOptions = {},
  setMessages: React.Dispatch<React.SetStateAction<AIMessage[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setDetectedTask: (task: any | null) => void,
  setPendingTaskConfirmation: (pending: boolean) => void,
  contextWindowRef: React.MutableRefObject<AIMessage[]>,
  profile?: any
) => {
  const sendMessage = useCallback(
    async (messageContent: string): Promise<SendMessageResult> => {
      try {
        setIsLoading(true);
        
        // Create user message
        const userMessage: AIMessage = {
          id: uuidv4(),
          content: messageContent,
          role: 'user',
          timestamp: new Date(),
        };
        
        // Immediately update UI with user message
        setMessages((prev) => [...prev, userMessage]);
        
        // Prepare context to send to the AI
        const recentMessages = [...contextWindowRef.current];
        
        // Add user profile context if available
        let userContext = '';
        if (profile) {
          userContext = `User: ${profile.full_name || 'Unknown'}`;
          if (profile.account_type) {
            userContext += `, Account Type: ${profile.account_type}`;
          }
        }
        
        // Call AI assistant endpoint
        const { data, error } = await supabase.functions.invoke('ai-assistant', {
          body: {
            message: messageContent,
            context: {
              messages: recentMessages,
              user: userContext,
              enableTaskCreation: options.enableTaskCreation !== false,
            },
          },
        });

        if (error) {
          console.error('AI assistant error:', error);
          return { success: false, error };
        }

        // Create assistant message
        const assistantMessage: AIMessage = {
          id: uuidv4(),
          content: data.response || 'Sorry, I encountered an error processing your request.',
          role: 'assistant',
          timestamp: new Date(),
        };
        
        // Update message list with assistant response
        setMessages((prev) => [...prev, assistantMessage]);
        
        // Update context window
        contextWindowRef.current = [...contextWindowRef.current, userMessage, assistantMessage];
        
        // Save to localStorage
        localStorage.setItem(
          `ai-chat-${options.sessionId || 'default'}`, 
          JSON.stringify([...contextWindowRef.current])
        );
        
        // Check for task detection
        if (data.detectedTask) {
          setDetectedTask(data.detectedTask);
          setPendingTaskConfirmation(true);
        }

        return { success: true };
      } catch (err) {
        console.error('Unexpected error in sendMessage:', err);
        return { success: false, error: err };
      } finally {
        setIsLoading(false);
      }
    },
    [options.enableTaskCreation, options.sessionId, profile, setDetectedTask, setIsLoading, setMessages, setPendingTaskConfirmation, contextWindowRef]
  );

  return { sendMessage };
};
