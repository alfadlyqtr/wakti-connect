
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export const useAIPageGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSections, setGeneratedSections] = useState<any[] | null>(null);
  const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState<string | null>(null);

  // Generate page content - simplified to just show feature removal message
  const generatePageContent = async () => {
    toast({
      title: "Feature Removed",
      description: "The AI page generation feature is no longer available.",
      variant: "destructive",
    });
    return [];
  };

  // Apply generated content - simplified to just show feature removal message
  const applyGeneratedContent = async () => {
    toast({
      title: "Feature Removed",
      description: "The AI page generation feature is no longer available.",
      variant: "destructive",
    });
    return [];
  };

  // Reset the generated content
  const resetGeneration = () => {
    setGeneratedSections(null);
    setLastGeneratedPrompt(null);
  };

  return {
    generatePageContent,
    applyGeneratedContent,
    isGenerating,
    generatedSections,
    lastGeneratedPrompt,
    resetGeneration
  };
};
