
import React from "react";
import { BusinessPageSection } from "@/types/business.types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import SectionCard from "./SectionCard";
import SectionActions from "./SectionActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
      console.log(`Updating section order: section ${sectionId} to order ${newOrder}`);
      const { data, error } = await supabase
        .from('business_page_sections')
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
      const { data, error } = await supabase
        .from('business_page_sections')
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
      const { error } = await supabase
        .from('business_page_sections')
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
    
    const orderedSections = [...pageSections].sort((a, b) => a.section_order - b.section_order);
    const currentIndex = orderedSections.findIndex(s => s.id === sectionId);
    let targetIndex;
    
    console.log(`Moving section ${sectionId} ${direction} from index ${currentIndex}`);
    
    if (direction === 'up' && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < orderedSections.length - 1) {
      targetIndex = currentIndex + 1;
    } else {
      console.log("Can't move further in this direction");
      return; // Can't move further
    }
    
    const targetSection = orderedSections[targetIndex];
    
    console.log(`Swapping with section at index ${targetIndex}:`, targetSection.id);
    
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
          <SectionCard 
            key={section.id} 
            section={section}
            displayOrder={index + 1}
            actionsComponent={
              <SectionActions 
                sectionId={section.id}
                isVisible={section.is_visible}
                isFirstSection={index === 0}
                isLastSection={index === pageSections.length - 1}
                onToggleVisibility={handleToggleVisibility}
                onMoveSection={handleMoveSection}
                onDeleteSection={handleDeleteSection}
              />
            }
          />
        ))}
    </div>
  );
};

export default SectionList;
