
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, Trash2, Wand2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useSectionEditor } from "@/hooks/useSectionEditor";

interface SectionEditorControlsProps {
  onTemplateClick: () => void;
}

const SectionEditorControls: React.FC<SectionEditorControlsProps> = ({ onTemplateClick }) => {
  const { 
    section, 
    moveUp, 
    moveDown, 
    duplicate, 
    toggleVisibility, 
    deleteSection 
  } = useSectionEditor();
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={moveUp}
          className="flex-1"
        >
          <ArrowUp className="w-4 h-4 mr-2" />
          <span>Up</span>
        </Button>
        
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={moveDown}
          className="flex-1"
        >
          <ArrowDown className="w-4 h-4 mr-2" />
          <span>Down</span>
        </Button>
        
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={onTemplateClick}
          className="flex-1"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          <span>Template</span>
        </Button>
        
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={duplicate}
          className="flex-1"
        >
          <Copy className="w-4 h-4 mr-2" />
          <span>Duplicate</span>
        </Button>
        
        <Button 
          type="button" 
          size="sm" 
          variant={section.is_visible ? "outline" : "secondary"}
          onClick={toggleVisibility}
          className="flex-1"
        >
          {section.is_visible ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              <span>Hide</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              <span>Show</span>
            </>
          )}
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              type="button" 
              size="sm" 
              variant="destructive"
              className="flex-1"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              <span>Delete</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Section</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this {section.section_type} section? 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={deleteSection}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default SectionEditorControls;
