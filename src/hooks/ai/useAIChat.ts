
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/ai-assistant.types';

export const useAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    setIsLoading(true);
    
    // Add user message to the chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      // Get the current session for authentication
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("Not authenticated");
      }

      // Create a mock AI response 
      // (In a real application, this would call an API endpoint)
      const mockAssistantResponse = await simulateAIResponse(content);
      
      // Add AI response to the chat
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: mockAssistantResponse,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error processing your request. Please try again later.",
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to simulate an AI response with a delay
  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple response logic
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      return "Hello! How can I assist you with WAKTI today?";
    }
    
    if (userMessage.toLowerCase().includes('task') || userMessage.toLowerCase().includes('to-do')) {
      return "I can help you manage your tasks. Would you like me to show you how to create a new task?";
    }
    
    if (userMessage.toLowerCase().includes('appointment') || userMessage.toLowerCase().includes('booking')) {
      return "WAKTI's appointment system allows you to schedule and manage bookings efficiently. Would you like to know more?";
    }
    
    return "I understand your message. Is there anything specific about WAKTI's features that you'd like to know more about?";
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  };
};
