
import React from "react";
import { useSectionEditor } from "./SectionEditorContext";
import { Button } from "@/components/ui/button";
import { LayoutTemplate } from "lucide-react";

interface SectionEditorHeaderProps {
  onTemplateClick: () => void;
}

const SectionEditorHeader: React.FC<SectionEditorHeaderProps> = ({ onTemplateClick }) => {
  const { isNewSection } = useSectionEditor();

  if (!isNewSection()) {
    return null;
  }

  return (
    <div className="bg-muted/50 p-4 rounded-md mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium">New Section</h4>
          <p className="text-xs text-muted-foreground">
            Get started quickly by choosing a template
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onTemplateClick}
        >
          <LayoutTemplate className="h-4 w-4 mr-2" />
          Choose Template
        </Button>
      </div>
    </div>
  );
};

export default SectionEditorHeader;
