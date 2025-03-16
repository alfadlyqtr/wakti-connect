
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SectionType } from "@/types/business.types";

interface AddSectionButtonsProps {
  onAddSection: (sectionType: SectionType) => void;
  isCreating: boolean;
}

const AddSectionButtons: React.FC<AddSectionButtonsProps> = ({ onAddSection, isCreating }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        onClick={() => onAddSection('header')}
        disabled={isCreating}
      >
        <Plus className="h-4 w-4 mr-2" />
        Header
      </Button>
      <Button 
        variant="outline" 
        onClick={() => onAddSection('services')}
        disabled={isCreating}
      >
        <Plus className="h-4 w-4 mr-2" />
        Services
      </Button>
      <Button 
        variant="outline" 
        onClick={() => onAddSection('hours')}
        disabled={isCreating}
      >
        <Plus className="h-4 w-4 mr-2" />
        Business Hours
      </Button>
      <Button 
        variant="outline" 
        onClick={() => onAddSection('contact')}
        disabled={isCreating}
      >
        <Plus className="h-4 w-4 mr-2" />
        Contact Info
      </Button>
      <Button 
        variant="outline" 
        onClick={() => onAddSection('gallery')}
        disabled={isCreating}
      >
        <Plus className="h-4 w-4 mr-2" />
        Gallery
      </Button>
      <Button 
        variant="outline" 
        onClick={() => onAddSection('about')}
        disabled={isCreating}
      >
        <Plus className="h-4 w-4 mr-2" />
        About
      </Button>
      <Button 
        variant="outline" 
        onClick={() => onAddSection('testimonials')}
        disabled={isCreating}
      >
        <Plus className="h-4 w-4 mr-2" />
        Testimonials
      </Button>
    </div>
  );
};

export default AddSectionButtons;
