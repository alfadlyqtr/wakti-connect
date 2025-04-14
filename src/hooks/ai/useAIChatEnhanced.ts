import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { AIMessage } from '@/types/ai-assistant.types';
import { TaskPriority } from '@/types/task.types';
import { toast } from '@/components/ui/use-toast';
import { useProfile } from '../useProfile';
import { useAuth } from '../auth';

// Define the AITaskDetectionResult interface locally since it's missing
interface AITaskDetectionResult {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string | null;
  category?: string;
}

// Define a local Task interface based on the properties we need
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  category?: string;
  userId: string;
  completedAt: string | null;
}

interface UseChatOptions {
  sessionId?: string;
  initialMessages?: AIMessage[];
  enableTaskCreation?: boolean;
}

export const useAIChatEnhanced = (options: UseChatOptions = {}) => {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  
  // Use initialMessages if provided, otherwise start with empty array
  const [messages, setMessages] = useState<AIMessage[]>(options.initialMessages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedTask, setDetectedTask] = useState<AITaskDetectionResult | null>(null);
  const [pendingTaskConfirmation, setPendingTaskConfirmation] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  
  // Generate a unique session ID if not provided
  const sessionIdRef = useRef(options.sessionId || `session-${uuidv4()}`);
  
  // Keep recent context in memory for faster back-references
  const contextWindowRef = useRef<AIMessage[]>([]);
  
  // Preserve message history across component remounts
  // This is crucial for maintaining chat persistence across mode switches
  useEffect(() => {
    // Check if there's a stored message history for this session
    const storedMessages = localStorage.getItem(`ai-chat-${sessionIdRef.current}`);
    if (storedMessages && (!options.initialMessages || options.initialMessages.length === 0)) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
          contextWindowRef.current = parsedMessages;
        }
      } catch (e) {
        console.error('Error parsing stored messages:', e);
      }
    }
  }, [options.initialMessages]);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`ai-chat-${sessionIdRef.current}`, JSON.stringify(messages));
      contextWindowRef.current = messages;
    }
  }, [messages]);
  
  const getRecentContext = useCallback(() => {
    return contextWindowRef.current;
  }, []);

  const sendMessage = useCallback(
    async (messageContent: string): Promise<AIMessage> => {
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
          throw new Error(`Error calling AI assistant: ${error.message}`);
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
        
        // Save to localStorage (redundant with the useEffect, but keeping for safety)
        localStorage.setItem(
          `ai-chat-${sessionIdRef.current}`, 
          JSON.stringify([...messages, userMessage, assistantMessage])
        );
        
        // Check for task detection
        if (data.detectedTask) {
          setDetectedTask(data.detectedTask);
          setPendingTaskConfirmation(true);
        }

        return assistantMessage;
      } catch (error) {
        console.error('Error in sendMessage:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to send message',
          variant: 'destructive',
        });
        
        // Add error message to the chat
        const errorMessage: AIMessage = {
          id: uuidv4(),
          content: 'Sorry, I encountered an error. Please try again.',
          role: 'assistant',
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, errorMessage]);
        
        return errorMessage;
      } finally {
        setIsLoading(false);
      }
    },
    [messages, options.enableTaskCreation, profile]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    contextWindowRef.current = [];
    localStorage.removeItem(`ai-chat-${sessionIdRef.current}`);
  }, []);

  const confirmCreateTask = useCallback(async (): Promise<Task | null> => {
    if (!detectedTask) return null;
    
    try {
      setIsCreatingTask(true);
      
      // API call to create the task would go here
      
      // For now, just simulate a successful creation
      const newTask: Task = {
        id: uuidv4(),
        title: detectedTask.title,
        description: detectedTask.description || '',
        status: 'pending',
        priority: detectedTask.priority || 'normal',
        dueDate: detectedTask.dueDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: detectedTask.category || 'daily',
        userId: user?.id || '',
        completedAt: null,
      };
      
      // Add confirmation message to chat
      const confirmationMessage: AIMessage = {
        id: uuidv4(),
        content: `I've created a new task: "${detectedTask.title}"`,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, confirmationMessage]);
      
      // Reset task states
      setDetectedTask(null);
      setPendingTaskConfirmation(false);
      
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsCreatingTask(false);
    }
  }, [detectedTask, user?.id]);

  const cancelCreateTask = useCallback(() => {
    // Add cancellation message to chat
    const cancellationMessage: AIMessage = {
      id: uuidv4(),
      content: 'I won\'t create a task for this. How else can I help you?',
      role: 'assistant',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, cancellationMessage]);
    
    // Reset task states
    setDetectedTask(null);
    setPendingTaskConfirmation(false);
  }, []);

  return {
    messages,
    setMessages,
    sendMessage,
    isLoading,
    clearMessages,
    detectedTask,
    confirmCreateTask,
    cancelCreateTask,
    isCreatingTask,
    pendingTaskConfirmation,
    getRecentContext,
  };
};
