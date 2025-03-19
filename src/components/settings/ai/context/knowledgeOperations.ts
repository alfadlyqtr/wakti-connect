
import { toast } from "@/components/ui/use-toast";

/**
 * Add knowledge to the AI assistant
 */
export const handleAddKnowledge = async (
  addKnowledgeMutation: any,
  title: string, 
  content: string, 
  setError: (error: string | null) => void
) => {
  try {
    await addKnowledgeMutation.mutateAsync({
      title,
      content
    });
    toast({
      title: "Knowledge added",
      description: "Your knowledge has been added to the AI assistant",
    });
  } catch (err) {
    console.error("Error adding knowledge:", err);
    setError("Unable to add knowledge. Please try again.");
    toast({
      title: "Error adding knowledge",
      description: "There was a problem adding your knowledge to the AI assistant",
      variant: "destructive",
    });
    throw err;
  }
};

/**
 * Delete knowledge from the AI assistant
 */
export const handleDeleteKnowledge = async (
  deleteKnowledgeMutation: any,
  id: string,
  setError: (error: string | null) => void
) => {
  try {
    await deleteKnowledgeMutation.mutateAsync(id);
    toast({
      title: "Knowledge deleted",
      description: "Your knowledge has been removed from the AI assistant",
    });
  } catch (err) {
    console.error("Error deleting knowledge:", err);
    setError("Unable to delete knowledge. Please try again.");
    toast({
      title: "Error deleting knowledge", 
      description: "There was a problem removing your knowledge from the AI assistant",
      variant: "destructive",
    });
    throw err;
  }
};
