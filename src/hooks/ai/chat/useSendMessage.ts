
import { useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { AIMessage } from '@/types/ai-assistant.types';
import { SendMessageResult, UseChatOptions } from './types';
import { toast } from '@/hooks/use-toast';

export const useSendMessage = (
  options: UseChatOptions = {},
  setMessages: React.Dispatch<React.SetStateAction<AIMessage[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setDetectedTask: (task: any | null) => void,
  setPendingTaskConfirmation: (pending: boolean) => void,
  contextWindowRef: React.MutableRefObject<AIMessage[]>,
  profile?: any
) => {
  const isSendingRef = useRef(false);
  const lastAttemptedMessageRef = useRef<string | null>(null);
  const retryAttemptsRef = useRef(0);
  const MAX_RETRY_ATTEMPTS = 3;

  const sendMessage = useCallback(
    async (messageContent: string): Promise<SendMessageResult> => {
      try {
        if (isSendingRef.current) {
          console.log("A message send operation is already in progress, aborting");
          return { 
            success: false, 
            error: new Error("Message sending already in progress") 
          };
        }

        lastAttemptedMessageRef.current = messageContent;
        
        isSendingRef.current = true;
        setIsLoading(true);
        
        console.log("Starting message send operation:", messageContent.substring(0, 20) + (messageContent.length > 20 ? "..." : ""));
        
        const userMessage: AIMessage = {
          id: uuidv4(),
          content: messageContent,
          role: 'user',
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, userMessage]);
        
        const recentMessages = [...contextWindowRef.current];
        
        let userContext = '';
        if (profile) {
          userContext = `User: ${profile.full_name || 'Unknown'}`;
          if (profile.account_type) {
            userContext += `, Account Type: ${profile.account_type}`;
          }
        }
        
        console.log("Sending message to AI assistant with context:", recentMessages.length, "messages");
        
        let functionCallTimedOut = false;
        const timeoutPromise = new Promise<{ data: null, error: Error }>((_, reject) => {
          setTimeout(() => {
            functionCallTimedOut = true;
            reject(new Error("Request timed out after 15 seconds"));
          }, 15000);
        });
        
        const functionCallPromise = supabase.functions.invoke('ai-assistant', {
          body: {
            message: messageContent,
            context: {
              messages: recentMessages,
              user: userContext,
              enableTaskCreation: options.enableTaskCreation !== false,
            },
          },
        });
        
        const { data, error } = await Promise.race([
          functionCallPromise,
          timeoutPromise
        ]);

        if (error || functionCallTimedOut) {
          console.error('AI assistant error:', error);
          
          toast({
            title: "Error",
            description: `Failed to get AI response: ${error.message || "Request timed out"}`,
            variant: "destructive",
          });
          
          contextWindowRef.current = [...contextWindowRef.current, userMessage];
          
          return { success: false, error, keepInputText: true };
        }

        if (!data || !data.response) {
          console.error('Empty or invalid response from AI assistant');
          
          toast({
            title: "Error",
            description: "Received an empty response from the assistant",
            variant: "destructive",
          });
          
          contextWindowRef.current = [...contextWindowRef.current, userMessage];
          
          return { success: false, error: new Error('Empty response'), keepInputText: true };
        }

        const assistantMessage: AIMessage = {
          id: uuidv4(),
          content: data.response,
          role: 'assistant',
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
        
        contextWindowRef.current = [...contextWindowRef.current, userMessage, assistantMessage];
        
        try {
          localStorage.setItem(
            `ai-chat-${options.sessionId || 'default'}`, 
            JSON.stringify([...contextWindowRef.current])
          );
          console.log("Successfully saved", contextWindowRef.current.length, "messages to localStorage");
        } catch (storageError) {
          console.error("Failed to save chat to localStorage:", storageError);
        }
        
        if (data.detectedTask) {
          setDetectedTask(data.detectedTask);
          setPendingTaskConfirmation(true);
        }

        retryAttemptsRef.current = 0;
        lastAttemptedMessageRef.current = null;
        
        console.log("Message send operation completed successfully");
        return { success: true };
      } catch (err) {
        console.error('Unexpected error in sendMessage:', err);
        
        const isChannelClosedError = err.message && 
            err.message.includes("message channel closed before a response was received");
        
        if (isChannelClosedError) {
          console.warn("Communication channel closed prematurely. Saving partial state.");
          
          toast({
            title: "Communication Error",
            description: "Connection interrupted. You can try sending your message again.",
            variant: "destructive",
          });
          
          return { 
            success: false, 
            error: err, 
            keepInputText: true,
            isChannelError: true
          };
        }
        
        toast({
          title: "Error",
          description: `Something went wrong: ${err.message || 'Unknown error'}`,
          variant: "destructive",
        });
        
        return { success: false, error: err, keepInputText: true };
      } finally {
        isSendingRef.current = false;
        setIsLoading(false);
      }
    },
    [options.enableTaskCreation, options.sessionId, profile, setDetectedTask, setIsLoading, setMessages, setPendingTaskConfirmation, contextWindowRef]
  );

  const retryLastMessage = useCallback(async (): Promise<SendMessageResult> => {
    if (!lastAttemptedMessageRef.current || isSendingRef.current) {
      return { 
        success: false, 
        error: new Error("No message to retry or send already in progress") 
      };
    }

    if (retryAttemptsRef.current >= MAX_RETRY_ATTEMPTS) {
      toast({
        title: "Too Many Retry Attempts",
        description: "Please modify your message or try again later.",
        variant: "destructive",
      });
      return { 
        success: false, 
        error: new Error("Maximum retry attempts reached") 
      };
    }

    retryAttemptsRef.current++;
    console.log(`Retry attempt ${retryAttemptsRef.current}/${MAX_RETRY_ATTEMPTS}`);
    
    toast({
      title: "Retrying",
      description: "Attempting to resend your message...",
      duration: 3000,
    });
    
    return sendMessage(lastAttemptedMessageRef.current);
  }, [sendMessage]);

  return { 
    sendMessage,
    retryLastMessage,
    isSending: isSendingRef.current,
    getLastAttemptedMessage: () => lastAttemptedMessageRef.current
  };
};
