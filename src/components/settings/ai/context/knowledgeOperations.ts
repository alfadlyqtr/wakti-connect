
import { UseMutationResult } from "@tanstack/react-query";
import { AIKnowledgeUpload, AIAssistantRole } from "@/types/ai-assistant.types";

export const handleAddKnowledge = async (
  addKnowledgeMutation: UseMutationResult<any, Error, { title: string; content: string; role?: AIAssistantRole }>,
  title: string,
  content: string,
  setError: (error: string | null) => void,
  role?: AIAssistantRole
) => {
  try {
    await addKnowledgeMutation.mutateAsync({ title, content, role });
    return true;
  } catch (error: any) {
    setError(error?.message || "Failed to add knowledge");
    return false;
  }
};

export const handleDeleteKnowledge = async (
  deleteKnowledgeMutation: UseMutationResult<any, Error, string>,
  id: string,
  setError: (error: string | null) => void
) => {
  try {
    await deleteKnowledgeMutation.mutateAsync(id);
    return true;
  } catch (error: any) {
    setError(error?.message || "Failed to delete knowledge");
    return false;
  }
};
