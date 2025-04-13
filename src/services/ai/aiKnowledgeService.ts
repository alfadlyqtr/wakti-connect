
import { supabase } from "@/integrations/supabase/client";
import { AIAssistantRole } from "@/types/ai-assistant.types";

/**
 * Add a knowledge item to the AI assistant
 */
export const addKnowledgeItem = async (
  userId: string, 
  title: string, 
  content: string, 
  role?: AIAssistantRole
) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const knowledgeItem = {
    user_id: userId,
    title,
    content,
    role,
    status: "ready",
  };

  const { data, error } = await supabase
    .from("ai_knowledge_uploads")
    .insert(knowledgeItem)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Delete a knowledge item
 */
export const deleteKnowledgeItem = async (id: string, userId: string) => {
  if (!id || !userId) {
    throw new Error("Knowledge item ID and user ID are required");
  }

  const { error } = await supabase
    .from("ai_knowledge_uploads")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return true;
};
