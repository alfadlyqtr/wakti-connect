
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
    }
  };
};
