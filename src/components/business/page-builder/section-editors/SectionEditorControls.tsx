
import React from "react";
import { Button } from "@/components/ui/button";
import { useSectionEditor } from "./SectionEditorContext";
import { Loader2, RotateCcw, Save, Template } from "lucide-react";

interface SectionEditorControlsProps {
  onTemplateClick: () => void;
}

const SectionEditorControls: React.FC<SectionEditorControlsProps> = ({
  onTemplateClick,
}) => {
  const { 
    handleSaveSection, 
    resetChanges, 
    isSubmitting,
    isDirty 
  } = useSectionEditor();
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 justify-between mt-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={onTemplateClick}
        >
          <Template className="h-4 w-4" />
          <span>Apply Template</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={resetChanges}
          disabled={!isDirty || isSubmitting}
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset Changes</span>
        </Button>
      </div>
      
      <Button
        variant="default"
        size="sm"
        className="flex items-center gap-1"
        onClick={handleSaveSection}
        disabled={!isDirty || isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        <span>Save Section</span>
      </Button>
    </div>
  );
};

export default SectionEditorControls;
