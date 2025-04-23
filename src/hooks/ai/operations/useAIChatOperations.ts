
import { useState, useCallback } from "react";
import { parseTaskWithAI, ParsedTask } from "@/services/ai/aiTaskParserService";
import { NestedSubtask } from "@/services/ai/aiTaskParserService";
import { toast } from "@/components/ui/use-toast";
import { TaskFormData } from "@/types/task.types";
import { convertParsedTaskToFormData } from "@/services/ai/aiTaskParserService";
import { useTasks } from "@/hooks/useTasks";
import { AIMessage } from "@/types/ai-assistant.types";

interface UseAIChatOperationsResult {
  parseTask: (text: string) => Promise<ParsedTask | null>;
  createTaskFromParsedResult: (
    parsedTask: ParsedTask,
    onSuccess?: (taskData: TaskFormData) => void,
    onError?: (error: Error) => void
  ) => Promise<void>;
  extractTaskFromMessage: (message: AIMessage) => Promise<ParsedTask | null>;
  // Add these missing properties required by useAIChat
  messages: AIMessage[];
  sendMessage: { mutateAsync: (text: string) => Promise<any> };
  clearMessages: () => void;
  isLoading: boolean;
  detectedTask: ParsedTask | null;
  confirmCreateTask: () => Promise<void>;
  cancelCreateTask: () => void;
  isCreatingTask: boolean;
  pendingTaskConfirmation: boolean;
}

export const useAIChatOperations = (): UseAIChatOperationsResult => {
  const { handleCreateTask } = useTasks();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedTask, setDetectedTask] = useState<ParsedTask | null>(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [pendingTaskConfirmation, setPendingTaskConfirmation] = useState(false);
  
  const parseTask = useCallback(async (text: string) => {
    try {
      const parsedTask = await parseTaskWithAI(text);
      return parsedTask;
    } catch (error) {
      console.error("Error parsing task with AI:", error);
      toast({
        title: "Task parsing failed",
        description: error instanceof Error ? error.message : "Failed to understand the task",
        variant: "destructive",
      });
      return null;
    }
  }, []);
  
  const createTaskFromParsedResult = useCallback(
    async (
      parsedTask: ParsedTask,
      onSuccess?: (taskData: TaskFormData) => void,
      onError?: (error: Error) => void
    ) => {
      try {
        if (!parsedTask) {
          throw new Error("Parsed task is null or undefined");
        }
        
        const taskData = convertParsedTaskToFormData(parsedTask);
        
        // Call the createTask function with the converted task data
        const newTask = await handleCreateTask(taskData);
        
        if (newTask) {
          toast({
            title: "Task created",
            description: `Task "${newTask.title}" created successfully.`,
          });
          
          if (onSuccess) {
            onSuccess(taskData);
          }
        } else {
          throw new Error("Failed to create task");
        }
      } catch (error) {
        console.error("Error creating task:", error);
        toast({
          title: "Task creation failed",
          description: error instanceof Error ? error.message : "Failed to create the task",
          variant: "destructive",
        });
        
        if (onError && error instanceof Error) {
          onError(error);
        }
      }
    },
    [handleCreateTask]
  );
  
  const extractTaskFromMessage = useCallback(async (message: AIMessage) => {
    if (message.role === 'assistant' && message.content) {
      return await parseTask(message.content);
    }
    return null;
  }, [parseTask]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setDetectedTask(null);
    setPendingTaskConfirmation(false);
  }, []);

  const confirmCreateTask = useCallback(async () => {
    if (!detectedTask) return;
    
    setIsCreatingTask(true);
    try {
      await createTaskFromParsedResult(detectedTask);
      setPendingTaskConfirmation(false);
      setDetectedTask(null);
    } finally {
      setIsCreatingTask(false);
    }
  }, [detectedTask, createTaskFromParsedResult]);

  const cancelCreateTask = useCallback(() => {
    setPendingTaskConfirmation(false);
    setDetectedTask(null);
  }, []);

  const sendMessage = {
    mutateAsync: async (text: string) => {
      setIsLoading(true);
      try {
        // Simulate sending a message and getting a response
        const newUserMessage: AIMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: text,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, newUserMessage]);
        
        // This is a placeholder for actual API call
        // In a real implementation, you would call your AI service here
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const responseMessage: AIMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I received your message: "${text}"`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, responseMessage]);
        
        // Check if the message contains a task
        const parsedTask = await parseTask(text);
        if (parsedTask) {
          setDetectedTask(parsedTask);
          setPendingTaskConfirmation(true);
        }
        
        return responseMessage;
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    parseTask,
    createTaskFromParsedResult,
    extractTaskFromMessage,
    messages,
    sendMessage,
    clearMessages,
    isLoading,
    detectedTask,
    confirmCreateTask,
    cancelCreateTask,
    isCreatingTask,
    pendingTaskConfirmation
  };
};
