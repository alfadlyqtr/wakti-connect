
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { AIMessage } from "@/types/ai-assistant.types";
import { useVoiceInteraction } from "@/hooks/ai/useVoiceInteraction";

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
  const [offTopicCount, setOffTopicCount] = useState(0);
  const [userFirstName, setUserFirstName] = useState<string>("");
  const { speak } = useVoiceInteraction();
  
  // Fetch user's name for personalized greetings
  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("full_name, display_name")
            .eq("id", user.id)
            .single();
            
          if (error) {
            console.error("Error fetching user profile:", error);
            return;
          }
          
          let name = "";
          if (data?.display_name) {
            name = data.display_name.split(" ")[0]; // Get first name
          } else if (data?.full_name) {
            name = data.full_name.split(" ")[0]; // Get first name
          }
          
          setUserFirstName(name);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      
      fetchUserProfile();
    }
  }, [user]);

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
      
      // Check if we need to enforce topic control (after 3 messages)
      const nonAssistantMessages = messages.filter(m => m.role === "user").length;
      let enhancedMessage = message;
      
      if (nonAssistantMessages >= 2 && offTopicCount >= 2) {
        // Force redirection after multiple off-topic messages
        const aiMessage: AIMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: `I notice we're getting a bit off-topic. As WAKTI AI, I'm specifically designed to help you with tasks, events, scheduling, business management, and other WAKTI platform features. For more general chat assistance, I recommend TMW AI which you can find at https://tmw.qa/ai-chat-bot/. Now, how can I help you with your productivity and business management needs?`,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, aiMessage]);
        setOffTopicCount(0); // Reset counter after redirection
        return { response: aiMessage.content };
      }
      
      // Call the edge function with the correct URL format
      const response = await fetch("https://sqdjqehcxpzsudhzjwbu.supabase.co/functions/v1/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          message: enhancedMessage,
          userName: userFirstName || undefined
        }),
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
      
      // Check if response appears to be off-topic
      const isOffTopic = checkIfOffTopic(message);
      if (isOffTopic) {
        setOffTopicCount(prev => prev + 1);
      } else {
        setOffTopicCount(0); // Reset if back on topic
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

  // Simple heuristic to check if a message appears to be off-topic
  const checkIfOffTopic = (message: string): boolean => {
    const waktiKeywords = [
      'task', 'event', 'booking', 'schedule', 'appointment', 
      'business', 'staff', 'wakti', 'meeting', 'calendar', 
      'deadline', 'project', 'reminder', 'todo', 'productivity'
    ];
    
    const messageLower = message.toLowerCase();
    
    // Check if any WAKTI keywords are in the message
    return !waktiKeywords.some(keyword => messageLower.includes(keyword));
  };

  const clearMessages = () => setMessages([
    {
      id: "welcome-message",
      role: "assistant",
      content: `Hello${userFirstName ? ` ${userFirstName}` : ''}! I'm your WAKTI AI assistant. How can I help you with your tasks, events, or business needs today?`,
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
