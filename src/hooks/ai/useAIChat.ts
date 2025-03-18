
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
      content: `Hello there! I'm your WAKTI AI assistant. How can I help you with your tasks, events, or business needs today?`,
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
      
      console.log("Sending message to AI assistant", { message, token: token.substring(0, 10) + "..." });
      
      // Call the edge function with the correct URL format
      const response = await fetch("https://sqdjqehcxpzsudhzjwbu.supabase.co/functions/v1/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });
      
      // Log response status for debugging
      console.log("AI assistant response status:", response.status);
      
      if (!response.ok) {
        let errorMessage = "Error communicating with AI assistant";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error("AI assistant error:", errorData);
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        throw new Error(errorMessage);
      }
      
      let data;
      try {
        data = await response.json();
        console.log("AI assistant response data:", data);
      } catch (e) {
        console.error("Failed to parse response JSON:", e);
        throw new Error("Invalid response from AI assistant");
      }
      
      if (!data || !data.response) {
        console.error("Unexpected response format:", data);
        throw new Error("Unexpected response format from AI assistant");
      }
      
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
      console.error("AI assistant error:", error);
      
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
      content: `Hello there! I'm your WAKTI AI assistant. How can I help you with your tasks, events, or business needs today?`,
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
