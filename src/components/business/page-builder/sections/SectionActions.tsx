
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Eye, EyeOff, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const buttonSize = isMobile ? "sm" : "icon";
  
  // Explicitly define event handler functions to prevent event bubbling
  const handleMoveUp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isFirstSection) {
      console.log('Moving section up:', sectionId);
      onMoveSection(sectionId, 'up');
    }
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLastSection) {
      console.log('Moving section down:', sectionId);
      onMoveSection(sectionId, 'down');
    }
  };

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Toggling visibility for section:', sectionId, 'Current visibility:', isVisible);
    onToggleVisibility(sectionId, isVisible);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Deleting section:', sectionId);
    onDeleteSection(sectionId);
  };
  
  return (
    <div className="flex items-center gap-1 flex-wrap justify-end">
      <Button 
        variant="ghost" 
        size={buttonSize}
        onClick={handleToggleVisibility}
        className="touch-target"
        type="button"
      >
        {isVisible ? 
          <Eye className="h-4 w-4" /> : 
          <EyeOff className="h-4 w-4" />
        }
        {isMobile && <span className="ml-2 text-xs">{isVisible ? "Hide" : "Show"}</span>}
      </Button>
      <Button 
        variant="ghost" 
        size={buttonSize}
        onClick={handleMoveUp}
        disabled={isFirstSection}
        className="touch-target"
        type="button"
      >
        <ArrowUp className="h-4 w-4" />
        {isMobile && <span className="ml-2 text-xs">Up</span>}
      </Button>
      <Button 
        variant="ghost" 
        size={buttonSize}
        onClick={handleMoveDown}
        disabled={isLastSection}
        className="touch-target"
        type="button"
      >
        <ArrowDown className="h-4 w-4" />
        {isMobile && <span className="ml-2 text-xs">Down</span>}
      </Button>
      <Button 
        variant="ghost" 
        size={buttonSize}
        onClick={handleDelete}
        className="touch-target"
        type="button"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
        {isMobile && <span className="ml-2 text-xs text-destructive">Delete</span>}
      </Button>
    </div>
  );
};

export default SectionActions;
