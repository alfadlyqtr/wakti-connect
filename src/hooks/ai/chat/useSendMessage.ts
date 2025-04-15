import { useCallback, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AIMessage } from '@/types/ai-assistant.types';
import { SendMessageResult, UseChatOptions } from './types';
import { toast } from '@/hooks/use-toast';
import { callAIAssistant } from '../utils/callAIAssistant';
import { useGlobalChatMemory } from './useGlobalChatMemory';

export const useSendMessage = (
  options: UseChatOptions = {},
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setDetectedTask: (task: any | null) => void,
  setPendingTaskConfirmation: (pending: boolean) => void,
  activeMode: string,
  profile?: any
) => {
  const isSendingRef = useRef(false);
  const lastAttemptedMessageRef = useRef<string | null>(null);
  const retryAttemptsRef = useRef(0);
  const MAX_RETRY_ATTEMPTS = 3;
  const [sendingStatus, setSendingStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  
  const { messages, addMessage } = useGlobalChatMemory(activeMode);

  const sendMessage = useCallback(
    async (messageContent: string): Promise<SendMessageResult> => {
      try {
        if (isSendingRef.current) {
          console.log("A message send operation is already in progress, aborting");
          return { 
            success: false, 
            error: new Error("Message sending already in progress"),
            keepInputText: false,
            messageStatus: 'failed'
          };
        }

        lastAttemptedMessageRef.current = messageContent;
        
        isSendingRef.current = true;
        setIsLoading(true);
        setSendingStatus('sending');
        
        console.log(`[useSendMessage] Starting message send operation for mode (${activeMode}):`, 
          messageContent.substring(0, 20) + (messageContent.length > 20 ? "..." : ""));
        
        const userMessage: AIMessage = {
          id: uuidv4(),
          content: messageContent,
          role: 'user',
          timestamp: new Date(),
        };
        
        addMessage(userMessage);
        
        let userContext = '';
        if (profile) {
          userContext = `User: ${profile.full_name || 'Unknown'}`;
          if (profile.account_type) {
            userContext += `, Account Type: ${profile.account_type}`;
          }
        }
        
        console.log("[useSendMessage] Sending message to AI assistant");
        
        const { response, error } = await callAIAssistant('', messageContent, userContext);

        if (error) {
          console.error('[useSendMessage] AI assistant error:', error);
          setSendingStatus('error');
          
          return { 
            success: false, 
            error, 
            keepInputText: true,
            isConnectionError: error.isConnectionError,
            messageStatus: 'failed'
          };
        }

        if (!response) {
          console.error('[useSendMessage] Empty response from AI assistant');
          setSendingStatus('error');
          
          return { 
            success: false, 
            error: new Error('Empty response'), 
            keepInputText: true,
            messageStatus: 'failed'
          };
        }

        const assistantMessage: AIMessage = {
          id: uuidv4(),
          content: response,
          role: 'assistant',
          timestamp: new Date(),
        };
        
        addMessage(assistantMessage);
        
        if (response.includes("[TASK_DETECTED]")) {
          const taskMatch = response.match(/\[TASK_DETECTED\](.*?)\[\/TASK_DETECTED\]/s);
          if (taskMatch && taskMatch[1]) {
            try {
              const detectedTask = JSON.parse(taskMatch[1]);
              setDetectedTask(detectedTask);
              setPendingTaskConfirmation(true);
            } catch (e) {
              console.error("[useSendMessage] Error parsing detected task:", e);
            }
          }
        }

        retryAttemptsRef.current = 0;
        lastAttemptedMessageRef.current = null;
        setSendingStatus('success');
        
        console.log("[useSendMessage] Message send operation completed successfully");
        return { 
          success: true,
          response: response,
          keepInputText: false,
          messageStatus: 'sent'
        };
      } catch (err) {
        console.error('[useSendMessage] Unexpected error in sendMessage:', err);
        setSendingStatus('error');
        
        const isChannelClosedError = err.message && 
            err.message.includes("message channel closed before a response was received");
        
        if (isChannelClosedError) {
          console.warn("[useSendMessage] Communication channel closed prematurely. Enabling retry.");
          
          toast({
            title: "Communication Error",
            description: "Connection interrupted. You can try again.",
            variant: "destructive",
          });
          
          return { 
            success: false, 
            error: err, 
            keepInputText: true,
            isChannelError: true,
            isConnectionError: true,
            messageStatus: 'failed'
          };
        }
        
        toast({
          title: "Error",
          description: `Something went wrong: ${err.message || 'Unknown error'}`,
          variant: "destructive",
        });
        
        return { 
          success: false,
          error: err,
          keepInputText: true,
          isConnectionError: true,
          messageStatus: 'failed'
        };
      } finally {
        isSendingRef.current = false;
        setIsLoading(false);
      }
    },
    [activeMode, options.enableTaskCreation, profile, setDetectedTask, setIsLoading, setPendingTaskConfirmation, addMessage]
  );

  const retryLastMessage = useCallback(async (): Promise<SendMessageResult> => {
    if (!lastAttemptedMessageRef.current || isSendingRef.current) {
      return { 
        success: false, 
        error: new Error("No message to retry or send already in progress"),
        keepInputText: false,
        messageStatus: 'failed'
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
        error: new Error("Maximum retry attempts reached"),
        keepInputText: true,
        messageStatus: 'failed'
      };
    }

    retryAttemptsRef.current++;
    console.log(`[useSendMessage] Retry attempt ${retryAttemptsRef.current}/${MAX_RETRY_ATTEMPTS}`);
    
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
    sendingStatus,
    getLastAttemptedMessage: () => lastAttemptedMessageRef.current
  };
};
