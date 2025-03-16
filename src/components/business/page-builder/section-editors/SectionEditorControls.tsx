
import React from "react";
import { useSectionEditor } from "@/hooks/useSectionEditor";
import { Button } from "@/components/ui/button";
import { Save, Loader2, LayoutTemplate } from "lucide-react";

interface SectionEditorControlsProps {
  onTemplateClick: () => void;
}

const SectionEditorControls: React.FC<SectionEditorControlsProps> = ({ onTemplateClick }) => {
  const { isDirty, handleSaveSection, updateSection } = useSectionEditor();
  
  return (
    <div className="flex justify-between items-center">
      {isDirty && (
        <p className="text-xs text-muted-foreground">
          Auto-saving changes...
        </p>
      )}
      
      <div className="ml-auto flex gap-2">
        <Button 
          variant="outline"
          onClick={onTemplateClick}
          title="Choose a template"
        >
          <LayoutTemplate className="h-4 w-4 mr-2" />
          Templates
        </Button>
        
        <Button 
          onClick={handleSaveSection}
          disabled={updateSection.isPending}
        >
          {updateSection.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Section
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SectionEditorControls;
