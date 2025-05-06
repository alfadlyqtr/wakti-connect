
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
      throw new Error("No page ID provided");
    }

    setIsGenerating(true);

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

      console.log("AI generation complete:", data);
      
      // Update state with generated sections
      setGeneratedSections(data.sections);
      setLastGeneratedPrompt(prompt);
      
      return data.sections;
    } catch (error: any) {
      console.error("Error in generatePageContent:", error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  // Apply generated content to the business page
  const applyGeneratedContent = async (pageId: string, sections: BusinessPageSection[]) => {
    try {
      // For existing sections, update them
      // For new sections, create them
      // This is simplified - a real implementation would need to handle section ordering and deletion
      
      const results = await Promise.all(
        sections.map(async (section, index) => {
          const existingSection = pageSections?.find(s => s.section_type === section.section_type);
          
          if (existingSection) {
            // Update existing section
            await updateSection({
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
              throw error;
            }
            
            return data.id;
          }
        })
      );
      
      console.log("Applied generated content:", results);
      return results;
    } catch (error) {
      console.error("Error applying generated content:", error);
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
