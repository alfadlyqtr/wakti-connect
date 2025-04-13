
import { supabase } from "@/integrations/supabase/client";
import { AIKnowledgeUpload, AIAssistantRole } from "@/types/ai-assistant.types";

// Fetch knowledge uploads for the current user
export const fetchKnowledgeUploads = async (): Promise<AIKnowledgeUpload[]> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return [];
  
  const { data, error } = await supabase
    .from('ai_knowledge_uploads')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return data as AIKnowledgeUpload[];
};

// Add a new knowledge upload
export const addKnowledgeUpload = async (
  title: string, 
  content: string,
  role?: AIAssistantRole
): Promise<AIKnowledgeUpload> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error('Not authenticated');
  
  const newKnowledge = {
    user_id: userData.user.id,
    title,
    content,
    role: role || 'general'
  };
  
  const { data, error } = await supabase
    .from('ai_knowledge_uploads')
    .insert(newKnowledge)
    .select()
    .single();
  
  if (error) throw error;
  
  return data as AIKnowledgeUpload;
};

// Delete a knowledge upload
export const deleteKnowledgeUpload = async (id: string): Promise<void> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error('Not authenticated');
  
  const { error } = await supabase
    .from('ai_knowledge_uploads')
    .delete()
    .eq('id', id)
    .eq('user_id', userData.user.id);
  
  if (error) throw error;
};
