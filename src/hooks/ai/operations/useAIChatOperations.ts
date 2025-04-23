import { useState, useCallback } from "react";
import { parseTaskWithAI } from "@/services/ai/aiTaskParserService";
import { ParsedTask } from "@/services/ai/aiTaskParserService";
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
}

export const useAIChatOperations = (): UseAIChatOperationsResult => {
  const { handleCreateTask } = useTasks();
  
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

  return {
    parseTask,
    createTaskFromParsedResult,
    extractTaskFromMessage,
  };
};
