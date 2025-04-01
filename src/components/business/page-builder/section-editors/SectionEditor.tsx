
import React, { useState } from "react";
import { BusinessPageSection } from "@/types/business.types";
import { SectionEditorProvider } from "./SectionEditorContext";
import SectionEditorHeader from "./SectionEditorHeader";
import SectionEditorFields from "./SectionEditorFields";
import SectionEditorControls from "./SectionEditorControls";
import SectionTemplateDialog from "./SectionTemplateDialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface SectionEditorProps {
  section: BusinessPageSection;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section }) => {
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <SectionEditorProvider section={section}>
      {(context) => (
        <div className={`space-y-${isMobile ? '3' : '4'}`}>
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
              // The actual template application is now handled in SectionTemplateDialog
              // via the new applyTemplateContent function
              setTemplateDialogOpen(false);
            }}
          />
        </div>
      )}
    </SectionEditorProvider>
  );
};

export default SectionEditor;
