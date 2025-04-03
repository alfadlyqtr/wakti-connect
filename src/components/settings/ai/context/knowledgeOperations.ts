
import { AIKnowledgeUpload } from "@/types/ai-assistant.types";
import { UseMutationResult } from "@tanstack/react-query";

export const handleAddKnowledge = async (
  addKnowledgeMutation: UseMutationResult<any, Error, { title: string; content: string }, unknown>,
  title: string,
  content: string,
  setError: (error: string | null) => void
) => {
  try {
    await addKnowledgeMutation.mutateAsync({ title, content });
    setError(null);
    return true;
  } catch (error) {
    console.error("Error adding knowledge:", error);
    setError(error instanceof Error ? error.message : "Unknown error occurred");
    return false;
  }
};

export const handleDeleteKnowledge = async (
  deleteKnowledgeMutation: UseMutationResult<any, Error, string, unknown>,
  id: string,
  setError: (error: string | null) => void
) => {
  try {
    await deleteKnowledgeMutation.mutateAsync(id);
    setError(null);
    return true;
  } catch (error) {
    console.error("Error deleting knowledge:", error);
    setError(error instanceof Error ? error.message : "Unknown error occurred");
    return false;
  }
};
