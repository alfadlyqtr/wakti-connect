
import { useContext } from "react";
import { SectionEditorContext } from "@/components/business/page-builder/section-editors/SectionEditorContext";

export const useSectionEditor = () => {
  const context = useContext(SectionEditorContext);
  if (context === undefined) {
    throw new Error("useSectionEditor must be used within a SectionEditorProvider");
  }
  
  return {
    ...context,
    // Helper function to update section styling
    updateSectionStyle: (styleName: string, value: string) => {
      context.handleStyleChange(styleName, value);
    },
    // Provide default implementations for functions used in SectionEditorControls
    moveUp: context.moveUp || (() => console.log("Move up not implemented")),
    moveDown: context.moveDown || (() => console.log("Move down not implemented")),
    duplicate: context.duplicate || (() => console.log("Duplicate not implemented")),
    toggleVisibility: context.toggleVisibility || (() => console.log("Toggle visibility not implemented")),
    deleteSection: context.deleteSection || (() => console.log("Delete section not implemented"))
  };
};
