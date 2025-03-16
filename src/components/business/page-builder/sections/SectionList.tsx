
import React from "react";
import { BusinessPageSection } from "@/types/business.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SectionEditor from "../section-editors/SectionEditor";
import SectionActions from "./SectionActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fromTable } from "@/integrations/supabase/helper";
import { toast } from "@/components/ui/use-toast";

interface SectionListProps {
  pageSections: BusinessPageSection[];
  businessPageId?: string;
}

const SectionList: React.FC<SectionListProps> = ({ 
  pageSections,
  businessPageId 
}) => {
  const queryClient = useQueryClient();
  
  // Section handling mutations
  const updateSectionOrder = useMutation({
    mutationFn: async ({ sectionId, newOrder }: { sectionId: string, newOrder: number }) => {
      const { data, error } = await fromTable('business_page_sections')
        .update({ section_order: newOrder })
        .eq('id', sectionId)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating section order:", error);
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
        title: "Failed to update section order",
        description: error.message
      });
    }
  });
  
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
  
  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!pageSections) return;
    
    const currentSection = pageSections.find(s => s.id === sectionId);
    if (!currentSection) return;
    
    const currentIndex = pageSections.findIndex(s => s.id === sectionId);
    let targetIndex;
    
    if (direction === 'up' && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < pageSections.length - 1) {
      targetIndex = currentIndex + 1;
    } else {
      return; // Can't move further
    }
    
    const targetSection = pageSections[targetIndex];
    
    // Swap orders
    updateSectionOrder.mutate({ 
      sectionId: currentSection.id, 
      newOrder: targetSection.section_order 
    });
    
    updateSectionOrder.mutate({ 
      sectionId: targetSection.id, 
      newOrder: currentSection.section_order 
    });
  };
  
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

  return (
    <div className="space-y-4">
      {[...pageSections]
        .sort((a, b) => a.section_order - b.section_order)
        .map((section, index) => (
          <Card key={section.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg capitalize flex items-center">
                  {section.section_type}
                  {!section.is_visible && (
                    <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                      Hidden
                    </span>
                  )}
                </CardTitle>
                <SectionActions 
                  sectionId={section.id}
                  isVisible={section.is_visible}
                  isFirstSection={index === 0}
                  isLastSection={index === pageSections.length - 1}
                  onToggleVisibility={handleToggleVisibility}
                  onMoveSection={handleMoveSection}
                  onDeleteSection={handleDeleteSection}
                />
              </div>
            </CardHeader>
            <CardContent>
              <SectionEditor section={section} />
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default SectionList;
