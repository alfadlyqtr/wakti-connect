
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fromTable } from "@/integrations/supabase/helper";

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface AISettings {
  assistant_name: string;
  tone: "formal" | "casual" | "concise" | "detailed" | "balanced";
  response_length: "short" | "balanced" | "detailed";
  proactiveness: boolean;
  suggestion_frequency: "low" | "medium" | "high";
  enabled_features: {
    tasks: boolean;
    events: boolean;
    staff: boolean;
    analytics: boolean;
    messaging: boolean;
  };
}

export interface AIKnowledgeUpload {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

export const useAIAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "welcome-message",
      role: "assistant",
      content: `Welcome! How can I assist you today?`,
      timestamp: new Date(),
    },
  ]);

  // Fetch user's AI settings
  const { data: aiSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["aiSettings", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      // Using regular supabase client instead of helper for known tables
      const { data, error } = await supabase
        .from("ai_assistant_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "No rows returned" which is fine for first-time users
        throw error;
      }

      if (!data) {
        // Create default settings if none exist
        const defaultSettings = {
          user_id: user.id,
          assistant_name: "WAKTI",
          tone: "balanced",
          response_length: "balanced",
          proactiveness: true,
          suggestion_frequency: "medium",
          enabled_features: {
            tasks: true,
            events: true,
            staff: true,
            analytics: true,
            messaging: true,
          },
        };

        const { data: newSettings, error: insertError } = await supabase
          .from("ai_assistant_settings")
          .insert(defaultSettings)
          .select()
          .single();

        if (insertError) throw insertError;
        return newSettings as unknown as AISettings;
      }

      return data as unknown as AISettings;
    },
    enabled: !!user,
  });

  // Check if user can use AI assistant
  const { data: canUseAI } = useQuery({
    queryKey: ["canUseAI", user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data } = await supabase
        .from("profiles")
        .select("account_type")
        .eq("id", user.id)
        .single();

      return data?.account_type === "business" || data?.account_type === "individual";
    },
    enabled: !!user,
  });

  // Update AI settings
  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<AISettings>) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("ai_assistant_settings")
        .update(newSettings)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as AISettings;
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Your AI assistant settings have been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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

  // Add knowledge for AI assistant
  const addKnowledge = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("ai_knowledge_uploads")
        .insert({
          user_id: user.id,
          title,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return data as unknown as AIKnowledgeUpload;
    },
    onSuccess: () => {
      toast({
        title: "Knowledge added",
        description: "Your knowledge has been added to the AI assistant.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding knowledge",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get knowledge uploads
  const { data: knowledgeUploads, isLoading: isLoadingKnowledge } = useQuery({
    queryKey: ["aiKnowledge", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("ai_knowledge_uploads")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data as unknown as AIKnowledgeUpload[];
    },
    enabled: !!user,
  });

  // Delete knowledge
  const deleteKnowledge = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("ai_knowledge_uploads")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      toast({
        title: "Knowledge deleted",
        description: "Your knowledge has been removed from the AI assistant.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting knowledge",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    messages,
    sendMessage,
    isLoading: sendMessage.isPending,
    aiSettings,
    isLoadingSettings,
    updateSettings,
    canUseAI,
    addKnowledge,
    knowledgeUploads,
    isLoadingKnowledge,
    deleteKnowledge,
    clearMessages: () => setMessages([
      {
        id: "welcome-message",
        role: "assistant",
        content: `Welcome! How can I assist you today?`,
        timestamp: new Date(),
      },
    ]),
  };
};
