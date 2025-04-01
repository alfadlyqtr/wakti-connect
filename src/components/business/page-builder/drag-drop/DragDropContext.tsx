
import React, { createContext, useState, useEffect } from "react";
import { BusinessPageSection } from "@/types/business.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fromTable } from "@/integrations/supabase/helper";
import { toast } from "@/components/ui/use-toast";

interface DragDropContextProps {
  sections: BusinessPageSection[];
  updateSectionOrder: (sections: BusinessPageSection[]) => void;
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
    setOrderedSections([...sections].sort((a, b) => a.section_order - b.section_order));
  }, [sections]);

  // Handle reordering of sections
  const updateSectionOrderMutation = useMutation({
    mutationFn: async (updatedSections: BusinessPageSection[]) => {
      // Log for debugging
      console.log("Updating section order with sections:", 
        updatedSections.map(s => ({ id: s.id, type: s.section_type, order: s.section_order }))
      );

      // Create a batch of update promises
      const updatePromises = updatedSections.map((section, index) => {
        return fromTable('business_page_sections')
          .update({ section_order: index })
          .eq('id', section.id);
      });
      
      // Execute all updates
      await Promise.all(updatePromises);
      
      return updatedSections;
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
    
    setOrderedSections(reorderedSections);
    updateSectionOrderMutation.mutate(reorderedSections);
  };

  return (
    <DragDropContext.Provider
      value={{
        sections: orderedSections,
        updateSectionOrder,
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
