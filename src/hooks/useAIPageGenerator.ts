
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BusinessPageSection } from "@/types/business.types";
import { useBusinessPage } from "./useBusinessPage";

export const useAIPageGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSections, setGeneratedSections] = useState<BusinessPageSection[] | null>(null);
  const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState<string | null>(null);
  const { pageSections, updateSection } = useBusinessPage();

  // Generate page content based on prompt
  const generatePageContent = async (prompt: string, pageId?: string) => {
    if (!pageId) {
      toast({
        title: "Error",
        description: "No page ID provided",
        variant: "destructive",
      });
      throw new Error("No page ID provided");
    }

    setIsGenerating(true);
    setGeneratedSections(null);

    try {
      console.log("Generating page content for prompt:", prompt);
      
      // Call the edge function to generate content
      const { data, error } = await supabase.functions.invoke('generate-page-content', {
        body: {
          prompt,
          pageId,
        },
      });

      if (error) {
        console.error("Error calling AI function:", error);
        throw new Error(error.message || "Failed to generate content");
      }

      if (!data || !data.sections) {
        console.error("Invalid response format from AI function:", data);
        throw new Error("Invalid response format from the AI service");
      }

      console.log("AI generation complete:", data);
      
      // Update state with generated sections
      setGeneratedSections(data.sections);
      setLastGeneratedPrompt(prompt);
      
      return data.sections;
    } catch (error: any) {
      console.error("Error in generatePageContent:", error);
      const errorMessage = error.message || "An unexpected error occurred";
      
      // Show a user-friendly toast with the error
      toast({
        title: "Generation failed",
        description: errorMessage.includes("fetch") 
          ? "Failed to connect to the AI service. Please try again later." 
          : errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  // Apply generated content to the business page
  const applyGeneratedContent = async (pageId: string, sections: BusinessPageSection[]) => {
    try {
      if (!sections || sections.length === 0) {
        toast({
          title: "No content to apply",
          description: "There are no sections to apply to your page",
          variant: "destructive",
        });
        return [];
      }
      
      // For existing sections, update them
      // For new sections, create them
      
      const results = await Promise.all(
        sections.map(async (section, index) => {
          try {
            const existingSection = pageSections?.find(s => s.section_type === section.section_type);
            
            if (existingSection) {
              // Update existing section
              await updateSection.mutateAsync({
                sectionId: existingSection.id,
                data: {
                  section_content: section.section_content,
                  section_order: index,
                  is_visible: true
                }
              });
              return existingSection.id;
            } else {
              // Create new section
              const { data, error } = await supabase
                .from('business_page_sections')
                .insert({
                  page_id: pageId,
                  section_type: section.section_type,
                  section_order: index,
                  section_content: section.section_content,
                  is_visible: true
                })
                .select()
                .single();
                
              if (error) {
                console.error("Error creating section:", error);
                throw error;
              }
              
              return data.id;
            }
          } catch (sectionError) {
            console.error("Error processing section:", section.section_type, sectionError);
            throw sectionError;
          }
        })
      );
      
      console.log("Applied generated content:", results);
      return results;
    } catch (error: any) {
      console.error("Error applying generated content:", error);
      toast({
        title: "Failed to apply changes",
        description: error.message || "An error occurred while applying changes",
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
