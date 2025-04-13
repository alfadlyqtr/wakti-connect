import { useState, useCallback, useEffect, useRef } from "react";
import { useAIChatOperations } from "./operations/useAIChatOperations";
import { AIMessage } from "@/types/ai-assistant.types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { TaskFormData } from "@/types/task.types";

// Maximum number of messages to keep in context memory
const MAX_CONTEXT_MESSAGES = 10;

/**
 * Enhanced version of AI chat hook with improved conversation flow
 */
export const useAIChatEnhanced = () => {
  const {
    messages,
    sendMessage: sendOperationsMessage,
    clearMessages,
    isLoading,
    detectedTask,
    confirmCreateTask,
    cancelCreateTask,
    isCreatingTask,
    pendingTaskConfirmation
  } = useAIChatOperations();
  
  const { toast } = useToast();
  const contextMemoryRef = useRef<AIMessage[]>([]);
  
  // Keep track of the last few messages to maintain conversation context
  useEffect(() => {
    if (messages.length > 0) {
      contextMemoryRef.current = messages.slice(-MAX_CONTEXT_MESSAGES);
    }
  }, [messages]);
  
  // Enhanced integration: Get application context for better responses
  const getApplicationContext = useCallback(async () => {
    try {
      // You would implement specific fetch calls here based on the user's role and needs
      // For example, getting task statistics, upcoming events, etc.
      const { data: taskCount, error: taskError } = await supabase
        .from('tasks')
        .select('id', { count: 'exact', head: true });
        
      // Get upcoming events
      const { data: upcomingEvents, error: eventError } = await supabase
        .from('events')
        .select('id, title, start_time')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(3);
      
      return {
        taskCount: taskCount !== null ? taskCount : 0,
        upcomingEvents: upcomingEvents || [],
        recentMessages: contextMemoryRef.current
      };
    } catch (error) {
      console.error("Error fetching application context:", error);
      return null;
    }
  }, []);
  
  // Enhanced sendMessage that includes application context
  const sendEnhancedMessage = useCallback(async (messageText: string) => {
    try {
      // Get application context first
      const context = await getApplicationContext();
      
      // Enhance the message with context if available
      let enhancedMessage = messageText;
      if (context) {
        // This would typically be handled in a more sophisticated way in the backend
        // But adding minimal context here as an example
        console.log("Adding application context to AI message:", context);
      }
      
      // Send the message (context will be added in the backend)
      return await sendOperationsMessage.mutateAsync(enhancedMessage);
    } catch (error) {
      console.error("Error sending enhanced message:", error);
      
      toast({
        title: "Error sending message",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      });
      
      throw error;
    }
  }, [sendOperationsMessage, getApplicationContext, toast]);
  
  return {
    messages,
    sendMessage: sendEnhancedMessage,
    clearMessages,
    isLoading: isLoading || sendOperationsMessage.isPending,
    detectedTask,
    confirmCreateTask,
    cancelCreateTask,
    isCreatingTask,
    pendingTaskConfirmation,
    getRecentContext: () => contextMemoryRef.current
  };
};
