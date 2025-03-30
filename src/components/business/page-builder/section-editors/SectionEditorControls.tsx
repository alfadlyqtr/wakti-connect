
import React from "react";
import { useSectionEditor } from "@/hooks/useSectionEditor";
import { Button } from "@/components/ui/button";
import { Save, Loader2, LayoutTemplate } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SectionEditorControlsProps {
  onTemplateClick: () => void;
}

const SectionEditorControls: React.FC<SectionEditorControlsProps> = ({ onTemplateClick }) => {
  const { isDirty, handleSaveSection, updateSection } = useSectionEditor();
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
      {isDirty && (
        <p className="text-xs text-muted-foreground order-last sm:order-first">
          Auto-saving changes...
        </p>
      )}
      
      <div className="w-full sm:w-auto sm:ml-auto flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline"
          onClick={onTemplateClick}
          title="Choose a template"
          className="w-full sm:w-auto"
          size={isMobile ? "sm" : "default"}
        >
          <LayoutTemplate className="h-4 w-4 mr-2" />
          Templates
        </Button>
        
        <Button 
          onClick={handleSaveSection}
          disabled={updateSection.isPending}
          className="w-full sm:w-auto"
          size={isMobile ? "sm" : "default"}
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
