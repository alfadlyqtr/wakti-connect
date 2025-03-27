
import React, { useState } from "react";
import { BusinessPageSection, SectionType } from "@/types/business.types";
import { Button } from "@/components/ui/button";
import { Globe, Wand2 } from "lucide-react";
import { AddSectionButtons } from "./";
import { EmptySectionState } from "./";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fromTable } from "@/integrations/supabase/helper";
import { toast } from "@/components/ui/use-toast";
import { DragDropProvider } from "../drag-drop/DragDropContext";
import DraggableSectionList from "../drag-drop/DraggableSectionList";
import { AIPageBuilder } from "../ai-assistant/AIPageBuilder";

interface PageSectionsTabProps {
  pageSections?: BusinessPageSection[];
  businessPageId?: string;
  getPublicPageUrl: () => string;
}

const PageSectionsTab: React.FC<PageSectionsTabProps> = ({ 
  pageSections, 
  businessPageId, 
  getPublicPageUrl 
}) => {
  const queryClient = useQueryClient();
  const [aiBuilderOpen, setAiBuilderOpen] = useState(false);

  // Section creation mutation
  const createSection = useMutation({
    mutationFn: async (sectionType: SectionType) => {
      if (!businessPageId) {
        throw new Error("No business page found");
      }
      
      // Calculate highest order + 1
      const highestOrder = pageSections && pageSections.length > 0
        ? Math.max(...pageSections.map(s => s.section_order))
        : -1;
      
      const nextOrder = highestOrder + 1;
      
      const { data, error } = await fromTable('business_page_sections')
        .insert({
          page_id: businessPageId,
          section_type: sectionType,
          section_order: nextOrder,
          section_title: `New ${sectionType} section`,
          section_content: {},
          is_visible: true
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating section:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Section created",
        description: "New section has been added to your page"
      });
      queryClient.invalidateQueries({ queryKey: ['businessPageSections'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create section",
        description: error.message
      });
    }
  });
  
  const handleAddSection = (sectionType: SectionType) => {
    createSection.mutate(sectionType);
  };

  // Section handling mutations
  const toggleSectionVisibility = useMutation({
    mutationFn: async ({ sectionId, isVisible }: { sectionId: string, isVisible: boolean }) => {
      const { data, error } = await fromTable('business_page_sections')
        .update({ is_visible: isVisible })
        .eq('id', sectionId)
        .select()
        .single();
      
      if (error) {
        console.error("Error toggling section visibility:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessPageSections'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update section visibility",
        description: error.message
      });
    }
  });
  
  const deleteSection = useMutation({
    mutationFn: async (sectionId: string) => {
      const { error } = await fromTable('business_page_sections')
        .delete()
        .eq('id', sectionId);
      
      if (error) {
        console.error("Error deleting section:", error);
        throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Section deleted",
        description: "The section has been removed from your page"
      });
      queryClient.invalidateQueries({ queryKey: ['businessPageSections'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to delete section",
        description: error.message
      });
    }
  });
  
  const handleToggleVisibility = (sectionId: string, currentVisibility: boolean) => {
    toggleSectionVisibility.mutate({
      sectionId,
      isVisible: !currentVisibility
    });
  };
  
  const handleDeleteSection = (sectionId: string) => {
    if (window.confirm("Are you sure you want to delete this section? This action cannot be undone.")) {
      deleteSection.mutate(sectionId);
    }
  };

  const handleAIGenerated = (data: any) => {
    console.log("AI generated page content:", data);
    // Implementation for adding AI-generated sections would go here
    toast({
      title: "AI Builder",
      description: "Content generated successfully. Now adding sections to your page.",
    });
    
    // For demonstration, add a header and about section
    createSection.mutate("header");
    setTimeout(() => createSection.mutate("about"), 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-medium">Available Sections</h2>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button 
            variant="outline"
            onClick={() => setAiBuilderOpen(true)}
          >
            <Wand2 className="h-4 w-4 mr-2" />
            AI Page Builder
          </Button>
          
          <Button 
            variant="outline" 
            asChild
          >
            <a href={getPublicPageUrl()} target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4 mr-2" />
              View Public Page
            </a>
          </Button>
        </div>
      </div>
      
      <AddSectionButtons 
        onAddSection={handleAddSection} 
        isCreating={createSection.isPending} 
      />
      
      <div className="mt-8">
        <h2 className="text-xl font-medium mb-4">Current Page Sections</h2>
        {pageSections && pageSections.length > 0 ? (
          <DragDropProvider sections={pageSections} pageId={businessPageId || ""}>
            <DraggableSectionList
              onToggleVisibility={handleToggleVisibility}
              onDeleteSection={handleDeleteSection}
            />
          </DragDropProvider>
        ) : (
          <EmptySectionState onAddSection={() => handleAddSection('header')} />
        )}
      </div>
      
      <AIPageBuilder 
        open={aiBuilderOpen}
        onOpenChange={setAiBuilderOpen}
        onPageGenerated={handleAIGenerated}
      />
    </div>
  );
};

export default PageSectionsTab;
