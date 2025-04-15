
import { useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AIMessage } from '@/types/ai-assistant.types';
import { SendMessageResult, UseChatOptions } from './types';
import { toast } from '@/hooks/use-toast';
import { callAIAssistant } from '../utils/callAIAssistant';

export const useSendMessage = (
  options: UseChatOptions = {},
  setMessages: React.Dispatch<React.SetStateAction<AIMessage[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setDetectedTask: (task: any | null) => void,
  setPendingTaskConfirmation: (pending: boolean) => void,
  messages: AIMessage[],
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

        // Store the message for potential retries
        lastAttemptedMessageRef.current = messageContent;
        
        // Set sending state
        isSendingRef.current = true;
        setIsLoading(true);
        
        console.log("Starting message send operation:", messageContent.substring(0, 20) + (messageContent.length > 20 ? "..." : ""));
        
        // Create and add user message to UI immediately but don't save to storage yet
        const userMessage: AIMessage = {
          id: uuidv4(),
          content: messageContent,
          role: 'user',
          timestamp: new Date(),
        };
        
        // Add user message to UI state
        setMessages((prev) => [...prev, userMessage]);
        
        // Use the current messages array directly
        const recentMessages = [...messages, userMessage];
        
        // Build user context
        let userContext = '';
        if (profile) {
          userContext = `User: ${profile.full_name || 'Unknown'}`;
          if (profile.account_type) {
            userContext += `, Account Type: ${profile.account_type}`;
          }
        }
        
        console.log("Sending message to AI assistant with context:", recentMessages.length, "messages");
        
        // Call the AI assistant using the improved utility function
        const { response, error } = await callAIAssistant('', messageContent, userContext);

        // Handle errors from the AI assistant call
        if (error) {
          console.error('AI assistant error:', error);
          
          // Remove the user message from the UI since we couldn't get a response
          setMessages((prev) => prev.filter(msg => msg.id !== userMessage.id));
          
          return { 
            success: false, 
            error, 
            keepInputText: true,
            isConnectionError: error.isConnectionError
          };
        }

        if (!response) {
          console.error('Empty response from AI assistant');
          
          // Remove the user message from the UI since we couldn't get a response
          setMessages((prev) => prev.filter(msg => msg.id !== userMessage.id));
          
          return { 
            success: false, 
            error: new Error('Empty response'), 
            keepInputText: true 
          };
        }

        // Create assistant message
        const assistantMessage: AIMessage = {
          id: uuidv4(),
          content: response,
          role: 'assistant',
          timestamp: new Date(),
        };
        
        const updatedMessages = [...recentMessages, assistantMessage];
        
        // Update UI with the assistant message
        setMessages(updatedMessages);
        
        // Now that we have both messages, save them to localStorage
        try {
          localStorage.setItem('wakti-ai-chat', JSON.stringify(updatedMessages));
          console.log("Successfully saved", updatedMessages.length, "messages to localStorage");
        } catch (storageError) {
          console.error("Failed to save chat to localStorage:", storageError);
        }
        
        // Check for detected task
        if (response.includes("[TASK_DETECTED]")) {
          // Parse task from response - simplified logic
          const taskMatch = response.match(/\[TASK_DETECTED\](.*?)\[\/TASK_DETECTED\]/s);
          if (taskMatch && taskMatch[1]) {
            try {
              const detectedTask = JSON.parse(taskMatch[1]);
              setDetectedTask(detectedTask);
              setPendingTaskConfirmation(true);
            } catch (e) {
              console.error("Error parsing detected task:", e);
            }
          }
        }

        // Reset retry state
        retryAttemptsRef.current = 0;
        lastAttemptedMessageRef.current = null;
        
        console.log("Message send operation completed successfully");
        return { success: true };
      } catch (err) {
        console.error('Unexpected error in sendMessage:', err);
        
        // Check for channel closed error
        const isChannelClosedError = err.message && 
            err.message.includes("message channel closed before a response was received");
        
        if (isChannelClosedError) {
          console.warn("Communication channel closed prematurely. Saving partial state.");
          
          toast({
            title: "Communication Error",
            description: "Connection interrupted. You can try sending your message again.",
            variant: "destructive",
          });
          
          // Remove the user message from the UI since the connection failed
          setMessages((prev) => prev.filter(msg => msg.id !== prev[prev.length - 1]?.id));
          
          return { 
            success: false, 
            error: err, 
            keepInputText: true,
            isChannelError: true,
            isConnectionError: true
          };
        }
        
        toast({
          title: "Error",
          description: `Something went wrong: ${err.message || 'Unknown error'}`,
          variant: "destructive",
        });
        
        // Remove the user message from the UI on error
        setMessages((prev) => prev.filter(msg => msg.id !== prev[prev.length - 1]?.id));
        
        return { 
          success: false,
          error: err,
          keepInputText: true,
          isConnectionError: true
        };
      } finally {
        isSendingRef.current = false;
        setIsLoading(false);
      }
    },
    [options.enableTaskCreation, profile, setDetectedTask, setIsLoading, setMessages, setPendingTaskConfirmation, messages]
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
