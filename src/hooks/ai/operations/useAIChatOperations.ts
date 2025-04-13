import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { AIMessage } from "@/types/ai-assistant.types";
import { callAIAssistant } from "../utils/callAIAssistant";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/hooks/useAuth";
import { useWAKTIFocusedConversation } from "../useWAKTIFocusedConversation";
import { parseTaskFromMessage, convertParsedTaskToFormData, generateTaskConfirmationText } from "../utils/taskParser";
import { createAITask, getEstimatedTaskTime } from "@/services/ai/aiTaskService";
import { parseTaskWithAI, NestedSubtask } from "@/services/ai/aiTaskParserService";
import { TaskFormData, SubTask } from "@/types/task.types";
import { toast } from "@/components/ui/use-toast";

const WAKTI_TOPICS = [
  "task management", "to-do lists", "appointments", "bookings", 
  "calendar", "scheduling", "contacts", "business management",
  "staff", "productivity", "organization", "time management"
];

const CONFIRMATION_PHRASES = [
  "go", "do it", "yes", "sure", "okay", "ok", "confirm", "approved", 
  "create it", "create task", "make it", "create", "make", "proceed",
  "looks good", "that's right", "correct", "perfect", "good", "great"
];

const REJECTION_PHRASES = [
  "no", "cancel", "stop", "don't", "abort", "cancel it", "nevermind",
  "forget it", "delete", "remove", "discard", "change", "wrong"
];

/**
 * Hook containing chat operations for AI Assistant
 */
export const useAIChatOperations = () => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [detectedTask, setDetectedTask] = useState<TaskFormData | null>(null);
  const [pendingTaskConfirmation, setPendingTaskConfirmation] = useState<boolean>(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const { user } = useAuth();
  const { 
    prepareMessageWithContext, 
    increaseFocus, 
    decreaseFocus 
  } = useWAKTIFocusedConversation();
  
  const clearDetectedTask = useCallback(() => {
    setDetectedTask(null);
    setPendingTaskConfirmation(false);
  }, []);
  
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: TaskFormData) => {
      setIsCreatingTask(true);
      try {
        const result = await createAITask(taskData);
        return result;
      } finally {
        setIsCreatingTask(false);
      }
    },
    onSuccess: (task) => {
      if (task) {
        const confirmationMessageId = uuidv4();
        const confirmationMessage: AIMessage = {
          id: confirmationMessageId,
          role: "assistant",
          content: `✅ I've created your task "${task.title}" successfully!${
            task.due_date ? ` It's due on ${new Date(task.due_date).toLocaleDateString()}.` : ''}${
            task.subtasks && task.subtasks.length > 0 ? ` Added ${task.subtasks.length} subtasks.` : ''}${
            task.location ? ` Location: ${task.location}` : ''}`,
          timestamp: new Date()
        };
        
        setMessages(prevMessages => [...prevMessages, confirmationMessage]);
        
        toast({
          title: "Task Created",
          description: `Your task "${task.title}" has been created successfully.`,
          variant: "success"
        });
      }
      
      clearDetectedTask();
    },
    onError: (error) => {
      const errorMessageId = uuidv4();
      const errorMessage: AIMessage = {
        id: errorMessageId,
        role: "assistant",
        content: `❌ I couldn't create your task. ${error instanceof Error ? error.message : 'Please try again or create it manually.'}`,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      clearDetectedTask();
    }
  });
  
  const confirmCreateTask = useCallback((taskData: TaskFormData) => {
    createTaskMutation.mutate(taskData);
  }, [createTaskMutation]);
  
  const cancelCreateTask = useCallback(() => {
    const cancellationMessageId = uuidv4();
    const cancellationMessage: AIMessage = {
      id: cancellationMessageId,
      role: "assistant",
      content: "I've cancelled the task creation. Is there anything else you'd like help with?",
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, cancellationMessage]);
    clearDetectedTask();
  }, [clearDetectedTask]);
  
  const isTaskConfirmation = useCallback((messageText: string): boolean => {
    const normalizedText = messageText.trim().toLowerCase();
    
    return CONFIRMATION_PHRASES.some(phrase => 
      normalizedText === phrase || 
      normalizedText.startsWith(phrase + " ") || 
      normalizedText.endsWith(" " + phrase) ||
      normalizedText.includes(" " + phrase + " ")
    );
  }, []);
  
  const isTaskRejection = useCallback((messageText: string): boolean => {
    const normalizedText = messageText.trim().toLowerCase();
    
    return REJECTION_PHRASES.some(phrase => 
      normalizedText === phrase || 
      normalizedText.startsWith(phrase + " ") || 
      normalizedText.endsWith(" " + phrase) ||
      normalizedText.includes(" " + phrase + " ")
    );
  }, []);
  
  const processMessageForTaskIntent = useCallback(async (messageText: string) => {
    if (pendingTaskConfirmation && detectedTask) {
      if (isTaskConfirmation(messageText)) {
        console.log("Detected task confirmation, proceeding with task creation");
        confirmCreateTask(detectedTask);
        return true;
      } else if (isTaskRejection(messageText)) {
        console.log("Detected task rejection, cancelling task creation");
        cancelCreateTask();
        return true;
      }
    }
    
    if (!pendingTaskConfirmation) {
      try {
        console.log("Attempting to parse task with AI:", messageText);
        const parsedTask = await parseTaskWithAI(messageText);
        
        if (parsedTask && parsedTask.title) {
          console.log("Task parsed successfully with AI:", parsedTask);
          
          const taskFormData = convertParsedTaskToFormData(parsedTask);
          
          const confirmationMessageId = uuidv4();
          
          let confirmationContent = `I'll create a task: **${parsedTask.title}**\n\n`;
          confirmationContent += "**Task Preview:**\n\n";
          confirmationContent += `**Title:** ${parsedTask.title}\n`;
          
          if (parsedTask.priority) {
            confirmationContent += `**Priority:** ${parsedTask.priority.charAt(0).toUpperCase() + parsedTask.priority.slice(1)}\n`;
          }
          
          if (parsedTask.due_date) {
            confirmationContent += `**Due Date:** ${new Date(parsedTask.due_date).toLocaleDateString()}\n`;
            
            if (parsedTask.due_time) {
              confirmationContent += `**Time:** ${parsedTask.due_time}\n`;
            }
          }
          
          if (parsedTask.location) {
            confirmationContent += `**Location:** ${parsedTask.location}\n`;
          }
          
          if (parsedTask.subtasks && parsedTask.subtasks.length > 0) {
            confirmationContent += `**Subtasks:**\n`;
            
            const renderSubtasks = (items: (string | NestedSubtask)[], indent = '') => {
              let result = '';
              
              items.forEach((item) => {
                if (typeof item === 'string') {
                  result += `${indent}- ${item}\n`;
                } else {
                  if (item.title || item.content) {
                    result += `${indent}- **${item.title || item.content}**\n`;
                  }
                  
                  if (item.subtasks && item.subtasks.length > 0) {
                    result += renderSubtasks(item.subtasks, `${indent}  `);
                  }
                }
              });
              
              return result;
            };
            
            confirmationContent += renderSubtasks(parsedTask.subtasks);
          }
          
          const countAllSubtasks = (items: (string | NestedSubtask)[]): number => {
            let count = 0;
            
            items.forEach(item => {
              if (typeof item === 'string') {
                count += 1;
              } else {
                count += 1;
                
                if (item.subtasks && item.subtasks.length > 0) {
                  count += countAllSubtasks(item.subtasks);
                }
              }
            });
            
            return count;
          };
          
          const totalSubtasks = countAllSubtasks(parsedTask.subtasks);
          const estimatedTime = totalSubtasks > 0 
            ? `${10 + (totalSubtasks * 5)} minutes` 
            : "a few minutes";
            
          confirmationContent += `\n**Estimated time:** ${estimatedTime}\n\n`;
          confirmationContent += "Would you like me to create this task? You can say something like 'Yes', 'Go ahead', or 'Create it'.";
          
          const confirmationMessage: AIMessage = {
            id: confirmationMessageId,
            role: "assistant",
            content: confirmationContent,
            timestamp: new Date()
          };
          
          setMessages(prevMessages => [...prevMessages, confirmationMessage]);
          
          setDetectedTask(taskFormData);
          setPendingTaskConfirmation(true);
          
          return true;
        }
      } catch (err) {
        console.error("Error parsing task with enhanced AI parser:", err);
      }
      
      const basicParsedTask = parseTaskFromMessage(messageText);
      
      if (basicParsedTask && basicParsedTask.title) {
        console.log("Detected task in message using basic parser:", basicParsedTask);
        
        const taskFormData = convertParsedTaskToFormData(basicParsedTask);
        
        const confirmationMessageId = uuidv4();
        
        const confirmationContent = generateTaskConfirmationText(basicParsedTask);
        
        const confirmationMessage: AIMessage = {
          id: confirmationMessageId,
          role: "assistant",
          content: confirmationContent,
          timestamp: new Date()
        };
        
        setMessages(prevMessages => [...prevMessages, confirmationMessage]);
        
        setDetectedTask(taskFormData);
        setPendingTaskConfirmation(true);
        
        return true;
      }
    }
    
    return false;
  }, [pendingTaskConfirmation, detectedTask, isTaskConfirmation, isTaskRejection, confirmCreateTask, cancelCreateTask]);
  
  const sendMessage = useMutation({
    mutationFn: async (messageText: string) => {
      const userMessageId = uuidv4();
      const aiMessageId = uuidv4();
      
      const isWaktiRelated = WAKTI_TOPICS.some(topic => 
        messageText.toLowerCase().includes(topic)
      );
      
      if (isWaktiRelated) {
        const topic = WAKTI_TOPICS.find(topic => 
          messageText.toLowerCase().includes(topic)
        );
        await increaseFocus(topic);
      } else {
        await decreaseFocus();
      }
      
      const contextualMessage = prepareMessageWithContext(messageText);
      
      const userMessage: AIMessage = {
        id: userMessageId,
        role: "user",
        content: messageText,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      const isTaskIntent = await processMessageForTaskIntent(messageText);
      
      if (isTaskIntent) {
        return null;
      }
      
      try {
        const token = "placeholder-token";
        const userName = user?.user_metadata?.full_name || user?.user_metadata?.name;
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const response = await callAIAssistant(token, contextualMessage, userName);
        
        const aiMessage: AIMessage = {
          id: aiMessageId,
          role: "assistant",
          content: response.response,
          timestamp: new Date()
        };
        
        setMessages(prevMessages => [...prevMessages, aiMessage]);
        
        return aiMessage;
      } catch (error) {
        console.error("Error sending message to AI:", error);
        
        const errorMessage: AIMessage = {
          id: aiMessageId,
          role: "error",
          content: error instanceof Error 
            ? `Sorry, I encountered an error: ${error.message}` 
            : "Sorry, I encountered an unexpected error. Please try again.",
          timestamp: new Date()
        };
        
        setMessages(prevMessages => [...prevMessages, errorMessage]);
        throw error;
      }
    }
  });
  
  const clearMessages = () => {
    setMessages([]);
    clearDetectedTask();
  };
  
  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading: sendMessage.isPending,
    detectedTask,
    confirmCreateTask,
    cancelCreateTask,
    isCreatingTask,
    pendingTaskConfirmation
  };
};
