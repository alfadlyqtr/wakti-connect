
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BusinessPageSection } from "@/types/business.types";

export const useAIPageGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSections, setGeneratedSections] = useState<BusinessPageSection[] | null>(null);
  const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState<string | null>(null);

  // Generate page content based on prompt - now accepts arguments but ignores them
  const generatePageContent = async (prompt: string, pageId?: string) => {
    // This function now just returns a stub message since the feature is removed
    setIsGenerating(true);
    
    try {
      console.log("AI Page Generation feature has been removed");
      
      // Show a user-friendly toast about the feature removal
      toast({
        title: "Feature Removed",
        description: "The AI page generation feature is no longer available.",
        variant: "destructive",
      });
      
      // Return an empty array to avoid breaking code that expects a result
      return [];
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Feature Removed",
        description: "The AI page generation feature is no longer available.",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  // Apply generated content to the business page - now accepts arguments but does nothing
  const applyGeneratedContent = async (pageId: string, sections: BusinessPageSection[]) => {
    try {
      console.log("AI Page Generation feature has been removed");
      
      toast({
        title: "Feature Removed",
        description: "The AI page generation feature is no longer available.",
        variant: "destructive",
      });
      
      // Return an empty array to avoid breaking code that expects a result
      return [];
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Feature Removed",
        description: "The AI page generation feature is no longer available.",
        variant: "destructive",
      });
      
      throw error;
    }
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
