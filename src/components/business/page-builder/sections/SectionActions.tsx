
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Eye, EyeOff, Trash2 } from "lucide-react";

interface SectionActionsProps {
  sectionId: string;
  isVisible: boolean;
  isFirstSection: boolean;
  isLastSection: boolean;
  onToggleVisibility: (sectionId: string, currentVisibility: boolean) => void;
  onMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
  onDeleteSection: (sectionId: string) => void;
}

const SectionActions: React.FC<SectionActionsProps> = ({
  sectionId,
  isVisible,
  isFirstSection,
  isLastSection,
  onToggleVisibility,
  onMoveSection,
  onDeleteSection
}) => {
  return (
    <div className="flex items-center space-x-1">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onToggleVisibility(sectionId, isVisible)}
      >
        {isVisible ? 
          <Eye className="h-4 w-4" /> : 
          <EyeOff className="h-4 w-4" />
        }
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onMoveSection(sectionId, 'up')}
        disabled={isFirstSection}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onMoveSection(sectionId, 'down')}
        disabled={isLastSection}
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onDeleteSection(sectionId)}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
};

export default SectionActions;
