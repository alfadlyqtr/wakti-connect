
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
import { classifyIntent, IntentType, IntentClassification } from "../utils/intentClassifier";

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
  
  // Intent classification and processing functions
  
  const processMessageForTaskIntent = useCallback(async (messageText: string, intentClassification: IntentClassification) => {
    // If we already have a pending task confirmation
    if (pendingTaskConfirmation && detectedTask) {
      // Check if this is a confirmation message
      if (intentClassification.intentType === 'confirmation') {
        console.log("Detected task confirmation, proceeding with task creation");
        confirmCreateTask(detectedTask);
        return true;
      } 
      // Check if this is a rejection message
      else if (intentClassification.intentType === 'rejection') {
        console.log("Detected task rejection, cancelling task creation");
        cancelCreateTask();
        return true;
      }
      // If it's neither confirmation nor rejection, continue with normal processing
    }
    
    // Only try to parse a task if the intent is task-creation
    if (intentClassification.intentType === 'task-creation' && !pendingTaskConfirmation) {
      try {
        console.log("Attempting to parse task with AI:", messageText);
        const parsedTask = await parseTaskWithAI(messageText);
        
        if (parsedTask && parsedTask.title) {
          console.log("Task parsed successfully with AI:", parsedTask);
          
          const taskFormData = convertParsedTaskToFormData({
            title: parsedTask.title,
            description: parsedTask.location ? `Location: ${parsedTask.location}` : undefined,
            priority: parsedTask.priority,
            subtasks: parsedTask.subtasks,
            due_date: parsedTask.due_date,
            dueTime: parsedTask.due_time,
            location: parsedTask.location,
            hasTimeConstraint: true,
            needsReview: false
          });
          
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
      
      // Fallback to basic parser if AI parser fails
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
  }, [pendingTaskConfirmation, detectedTask, confirmCreateTask, cancelCreateTask]);
  
  // Process messages for image generation intent
  const processMessageForImageIntent = useCallback((messageText: string, intentClassification: IntentClassification) => {
    if (intentClassification.intentType === 'image-generation' && intentClassification.confidence > 0.65) {
      console.log("Detected image generation intent:", messageText);
      
      // For now, just communicate that we detected this intent
      const responseMessageId = uuidv4();
      const responseMessage: AIMessage = {
        id: responseMessageId,
        role: "assistant",
        content: "I understand you want to generate an image. In the future, I'll be able to generate images based on your description. For now, I can help with other requests.",
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, responseMessage]);
      return true;
    }
    
    return false;
  }, []);
  
  // Process messages for other special intents
  const processMessageForSpecialIntent = useCallback((messageText: string, intentClassification: IntentClassification) => {
    // Handle other special intents here as needed
    return false;
  }, []);
  
  const sendMessage = useMutation({
    mutationFn: async (messageText: string) => {
      const userMessageId = uuidv4();
      const aiMessageId = uuidv4();
      
      // Classify the intent of the message
      const intentClassification = classifyIntent(messageText);
      console.log(`[Intent Classification] Message: "${messageText.substring(0, 30)}..." → Intent: ${intentClassification.intentType} (${intentClassification.confidence.toFixed(2)})`);
      
      // Check if this is related to WAKTI topics to adjust focus
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
      
      // Process the message based on its intent
      // Order matters here - we check for special intents first
      let isHandled = false;
      
      // First check if this is a task-related intent
      if (intentClassification.intentType === 'task-creation' || 
          intentClassification.intentType === 'confirmation' || 
          intentClassification.intentType === 'rejection') {
        isHandled = await processMessageForTaskIntent(messageText, intentClassification);
      }
      
      // If not handled as a task, check if it's an image generation request
      if (!isHandled && intentClassification.intentType === 'image-generation') {
        isHandled = processMessageForImageIntent(messageText, intentClassification);
      }
      
      // Check for other special intents
      if (!isHandled) {
        isHandled = processMessageForSpecialIntent(messageText, intentClassification);
      }
      
      // If no special handling, process as a general message
      if (!isHandled) {
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
      
      return null;
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
