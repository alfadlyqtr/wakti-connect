
import React from "react";
import { useSectionEditor } from "@/hooks/useSectionEditor";
import { Button } from "@/components/ui/button";
import { LayoutTemplate } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SectionEditorHeaderProps {
  onTemplateClick: () => void;
}

const SectionEditorHeader: React.FC<SectionEditorHeaderProps> = ({ onTemplateClick }) => {
  const { isNewSection } = useSectionEditor();
  const isMobile = useIsMobile();

  if (!isNewSection()) {
    return null;
  }

  return (
    <div className="bg-muted/50 p-3 sm:p-4 rounded-md mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <div>
          <h4 className="text-sm font-medium">New Section</h4>
          <p className="text-xs text-muted-foreground">
            Get started quickly by choosing a template
          </p>
        </div>
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "sm"}
          onClick={onTemplateClick}
          className="w-full sm:w-auto mt-2 sm:mt-0"
        >
          <LayoutTemplate className="h-4 w-4 mr-2" />
          Choose Template
        </Button>
      </div>
    </div>
  );
};

export default SectionEditorHeader;
