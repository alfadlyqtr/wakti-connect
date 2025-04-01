
import React, { createContext, useState, useEffect } from "react";
import { BusinessPageSection } from "@/types/business.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fromTable } from "@/integrations/supabase/helper";
import { toast } from "@/components/ui/use-toast";

interface DragDropContextProps {
  sections: BusinessPageSection[];
  updateSectionOrder: (sections: BusinessPageSection[]) => void;
  moveSectionUpDown: (sectionId: string, direction: 'up' | 'down') => void;
  isUpdating: boolean;
}

export const DragDropContext = createContext<DragDropContextProps | undefined>(undefined);

export const DragDropProvider: React.FC<{
  children: React.ReactNode;
  sections: BusinessPageSection[];
  pageId: string;
}> = ({ children, sections, pageId }) => {
  const [orderedSections, setOrderedSections] = useState<BusinessPageSection[]>(sections);
  const queryClient = useQueryClient();

  // Update sections when prop changes
  useEffect(() => {
    // Deep clone the sections and sort them to avoid mutation issues
    setOrderedSections([...sections].sort((a, b) => a.section_order - b.section_order));
  }, [sections]);

  // Handle reordering of sections
  const updateSectionOrderMutation = useMutation({
    mutationFn: async (updatedSections: BusinessPageSection[]) => {
      // Log for debugging
      console.log("Updating section order with sections:", 
        updatedSections.map(s => ({ id: s.id, type: s.section_type, order: s.section_order }))
      );

      try {
        // Create a batch of update promises
        const updatePromises = updatedSections.map((section, index) => {
          return fromTable('business_page_sections')
            .update({ section_order: index })
            .eq('id', section.id);
        });
        
        // Execute all updates in a single batch
        await Promise.all(updatePromises);
        
        return updatedSections;
      } catch (error) {
        console.error("Error updating section orders:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Layout updated",
        description: "Your page sections have been reordered",
      });
      queryClient.invalidateQueries({ queryKey: ['businessPageSections', pageId] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update layout",
        description: error.message,
      });
    }
  });

  const updateSectionOrder = (reorderedSections: BusinessPageSection[]) => {
    // Log the reordering for debugging
    console.log("Section order before update:", 
      orderedSections.map(s => ({ id: s.id, type: s.section_type, order: s.section_order }))
    );
    console.log("Section order after update:", 
      reorderedSections.map(s => ({ id: s.id, type: s.section_type, order: s.section_order }))
    );
    
    // Create a completely new array to avoid mutation issues
    const newSections = reorderedSections.map((section, index) => ({
      ...section,
      section_order: index
    }));
    
    setOrderedSections(newSections);
    updateSectionOrderMutation.mutate(newSections);
  };

  // Improved function for moving sections up or down
  const moveSectionUpDown = (sectionId: string, direction: 'up' | 'down') => {
    console.log(`Moving section ${sectionId} ${direction}`);
    
    // Create a fresh sorted copy of the sections to avoid mutation issues
    const sortedSections = [...orderedSections].sort((a, b) => a.section_order - b.section_order);
    
    const currentIndex = sortedSections.findIndex(s => s.id === sectionId);
    if (currentIndex === -1) {
      console.error('Section not found:', sectionId);
      return;
    }
    
    // Can't move first section up or last section down
    if ((direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === sortedSections.length - 1)) {
      console.log(`Cannot move section ${direction} as it's at the ${direction === 'up' ? 'top' : 'bottom'} already`);
      return;
    }
    
    // Determine target index
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Create completely new array with swapped elements
    const newSections = [...sortedSections];
    
    // Simply swap the array positions, NOT just the order values
    const temp = newSections[currentIndex];
    newSections[currentIndex] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    
    // Now assign sequential order values to ensure consistency
    const reorderedSections = newSections.map((section, index) => ({
      ...section,
      section_order: index
    }));
    
    console.log('Updated section order:', 
      reorderedSections.map(s => ({ id: s.id, type: s.section_type, order: s.section_order }))
    );
    
    // Update the state and save to database
    setOrderedSections(reorderedSections);
    updateSectionOrderMutation.mutate(reorderedSections);
  };

  return (
    <DragDropContext.Provider
      value={{
        sections: orderedSections,
        updateSectionOrder,
        moveSectionUpDown,
        isUpdating: updateSectionOrderMutation.isPending
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
};

export const useDragDrop = () => {
  const context = React.useContext(DragDropContext);
  if (context === undefined) {
    throw new Error("useDragDrop must be used within a DragDropProvider");
  }
  return context;
};
