
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { AIMessage } from "@/types/ai-assistant.types";

export const useAIChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "welcome-message",
      role: "assistant",
      content: `Welcome! How can I assist you today?`,
      timestamp: new Date(),
    },
  ]);

  // Send message to AI assistant
  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      if (!user) throw new Error("User not authenticated");
      
      // Add user message to the list
      const userMessage: AIMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: message,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, userMessage]);
      
      // Get authentication token
      const { data: authData } = await supabase.auth.getSession();
      const token = authData.session?.access_token;
      
      if (!token) throw new Error("Authentication token not found");
      
      // Call the edge function
      const response = await fetch("/functions/v1/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error communicating with AI assistant");
      }
      
      const data = await response.json();
      
      // Add AI response to the list
      const aiMessage: AIMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      
      return data;
    },
    onError: (error) => {
      // Add error message to the list
      const errorMessage: AIMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: `I apologize, but I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const clearMessages = () => setMessages([
    {
      id: "welcome-message",
      role: "assistant",
      content: `Welcome! How can I assist you today?`,
      timestamp: new Date(),
    },
  ]);

  return {
    messages,
    sendMessage,
    isLoading: sendMessage.isPending,
    clearMessages,
  };
};
