
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { AIKnowledgeUpload, AIAssistantRole } from "@/types/ai-assistant.types";

export const useAIKnowledge = () => {
  const { user } = useAuth();

  // Add knowledge for AI assistant
  const addKnowledge = useMutation({
    mutationFn: async ({ title, content, role }: { 
      title: string; 
      content: string;
      role?: AIAssistantRole;
    }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("ai_knowledge_uploads")
        .insert({
          user_id: user.id,
          title,
          content,
          role,
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
    addKnowledge,
    knowledgeUploads,
    isLoadingKnowledge,
    deleteKnowledge,
  };
};
