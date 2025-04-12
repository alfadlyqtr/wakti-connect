import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { AIMessage } from "@/types/ai-assistant.types";
import { callAIAssistant } from "../utils/callAIAssistant";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/hooks/useAuth";
import { useWAKTIFocusedConversation } from "../useWAKTIFocusedConversation";
import { parseTaskFromMessage, convertParsedTaskToFormData, generateTaskConfirmationText } from "../utils/taskParser";
import { createAITask, getEstimatedTaskTime } from "@/services/ai/aiTaskService";
import { TaskFormData } from "@/types/task.types";
import { toast } from "@/components/ui/use-toast";

const WAKTI_TOPICS = [
  "task management", "to-do lists", "appointments", "bookings", 
  "calendar", "scheduling", "contacts", "business management",
  "staff", "productivity", "organization", "time management"
];

// List of confirmation words that accept task creation
const CONFIRMATION_PHRASES = [
  "go", "do it", "yes", "sure", "okay", "ok", "confirm", "approved", 
  "create it", "create task", "make it", "create", "make", "proceed",
  "looks good", "that's right", "correct", "perfect", "good", "great"
];

// List of rejection words that cancel task creation
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
  
  // Clear currently detected task
  const clearDetectedTask = useCallback(() => {
    setDetectedTask(null);
    setPendingTaskConfirmation(false);
  }, []);
  
  // Mutation for actually creating the task
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
        // Add AI confirmation message
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
      
      // Clear detected task
      clearDetectedTask();
    },
    onError: (error) => {
      // Add error message
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
  
  // Confirm task creation
  const confirmCreateTask = useCallback((taskData: TaskFormData) => {
    createTaskMutation.mutate(taskData);
  }, [createTaskMutation]);
  
  // Cancel task creation
  const cancelCreateTask = useCallback(() => {
    // Add cancellation message
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
  
  // Check if a message is a task confirmation
  const isTaskConfirmation = useCallback((messageText: string): boolean => {
    const normalizedText = messageText.trim().toLowerCase();
    
    // Check for explicit confirmations
    return CONFIRMATION_PHRASES.some(phrase => 
      normalizedText === phrase || 
      normalizedText.startsWith(phrase + " ") || 
      normalizedText.endsWith(" " + phrase) ||
      normalizedText.includes(" " + phrase + " ")
    );
  }, []);
  
  // Check if a message is a task rejection
  const isTaskRejection = useCallback((messageText: string): boolean => {
    const normalizedText = messageText.trim().toLowerCase();
    
    // Check for explicit rejections
    return REJECTION_PHRASES.some(phrase => 
      normalizedText === phrase || 
      normalizedText.startsWith(phrase + " ") || 
      normalizedText.endsWith(" " + phrase) ||
      normalizedText.includes(" " + phrase + " ")
    );
  }, []);
  
  // Process message for task intent and extract task data
  const processMessageForTaskIntent = useCallback((messageText: string) => {
    // If we're awaiting confirmation and this is a confirmation message
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
    
    // If we're not already waiting for a confirmation, check for task intent
    if (!pendingTaskConfirmation) {
      // Try to parse task from message
      const parsedTask = parseTaskFromMessage(messageText);
      
      if (parsedTask && parsedTask.title) {
        console.log("Detected task in message:", parsedTask);
        
        // Convert parsed task to form data
        const taskFormData = convertParsedTaskToFormData(parsedTask);
        
        // Create task confirmation message
        const confirmationMessageId = uuidv4();
        
        // Generate a human-friendly confirmation text
        const confirmationContent = generateTaskConfirmationText(parsedTask);
        
        const confirmationMessage: AIMessage = {
          id: confirmationMessageId,
          role: "assistant",
          content: confirmationContent,
          timestamp: new Date()
        };
        
        setMessages(prevMessages => [...prevMessages, confirmationMessage]);
        
        // Set detected task for confirmation
        setDetectedTask(taskFormData);
        setPendingTaskConfirmation(true);
        
        return true;
      }
    }
    
    return false;
  }, [pendingTaskConfirmation, detectedTask, isTaskConfirmation, isTaskRejection, confirmCreateTask, cancelCreateTask]);

  // Mutation for sending a message to AI Assistant
  const sendMessage = useMutation({
    mutationFn: async (messageText: string) => {
      // Create unique IDs for messages
      const userMessageId = uuidv4();
      const aiMessageId = uuidv4();
      
      // Analyze if the message is about WAKTI topics
      const isWaktiRelated = WAKTI_TOPICS.some(topic => 
        messageText.toLowerCase().includes(topic)
      );
      
      // If message is related to WAKTI, increase focus
      if (isWaktiRelated) {
        const topic = WAKTI_TOPICS.find(topic => 
          messageText.toLowerCase().includes(topic)
        );
        await increaseFocus(topic);
      } else {
        // If not related, slightly decrease focus
        await decreaseFocus();
      }
      
      // Prepare message with WAKTI context
      const contextualMessage = prepareMessageWithContext(messageText);
      
      // Create and add user message to the messages array (show original message to user)
      const userMessage: AIMessage = {
        id: userMessageId,
        role: "user",
        content: messageText,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      // Check if message contains task intent or is a confirmation before sending to AI
      const isTaskIntent = processMessageForTaskIntent(messageText);
      
      // If this is a task intent or confirmation, don't send to the AI yet
      if (isTaskIntent) {
        return null;
      }
      
      try {
        // Get the token for authentication
        const token = "placeholder-token"; // This should come from auth context
        
        const userName = user?.user_metadata?.full_name || user?.user_metadata?.name;
        
        // Artificially add a small delay to see the loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Make the API call with contextual message
        const response = await callAIAssistant(token, contextualMessage, userName);
        
        // Create and add AI message to the messages array
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
        
        // Create and add error message
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
  
  // Clear all messages
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
