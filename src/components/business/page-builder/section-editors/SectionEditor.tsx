import React, { useState } from "react";
import { BusinessPageSection } from "@/types/business.types";
import { SectionEditorProvider } from "./SectionEditorContext";
import SectionEditorHeader from "./SectionEditorHeader";
import SectionEditorFields from "./SectionEditorFields";
import SectionEditorControls from "./SectionEditorControls";
import SectionTemplateDialog from "./SectionTemplateDialog";
import { useSectionEditor } from "@/hooks/useSectionEditor";

interface SectionEditorProps {
  section: BusinessPageSection;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section }) => {
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  
  return (
    <SectionEditorProvider section={section}>
      <div className="space-y-4">
        <SectionEditorHeader 
          onTemplateClick={() => setTemplateDialogOpen(true)} 
        />
        
        <SectionEditorFields />
        
        <SectionEditorControls 
          onTemplateClick={() => setTemplateDialogOpen(true)} 
        />
        
        <SectionTemplateDialog 
          isOpen={templateDialogOpen}
          onOpenChange={setTemplateDialogOpen}
          sectionType={section.section_type}
          onSelect={(templateContent) => {
            // This callback needs to be implemented here at the top level
            // because we need access to the section state which is managed by the context
            const context = useSectionEditor();
            context.setContentData(templateContent);
            context.setIsDirty(true);
            context.updateSection.mutate({
              sectionId: section.id,
              content: templateContent
            });
            setTemplateDialogOpen(false);
          }}
        />
      </div>
    </SectionEditorProvider>
  );
};

export default SectionEditor;
