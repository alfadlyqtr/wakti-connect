
import React from "react";
import { SectionType } from "../types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Layout, 
  ChevronDown, 
  ChevronUp, 
  Trash2,
  Plus
} from "lucide-react";
import SectionEditor from "./SectionEditor";

interface SectionsTabProps {
  sections: SectionType[];
  activeSectionIndex: number | null;
  updateSection: (index: number, section: SectionType) => void;
  addSection: (type: string) => void;
  removeSection: (index: number) => void;
  moveSectionUp: (index: number) => void;
  moveSectionDown: (index: number) => void;
  setActiveSectionIndex: (index: number | null) => void;
}

const SectionsTab: React.FC<SectionsTabProps> = ({
  sections,
  activeSectionIndex,
  updateSection,
  addSection,
  removeSection,
  moveSectionUp,
  moveSectionDown,
  setActiveSectionIndex
}) => {
  const sectionTypes = [
    { id: 'header', label: 'Header/Hero' },
    { id: 'about', label: 'About Us' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
    { id: 'hours', label: 'Business Hours' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'booking', label: 'Booking' },
    { id: 'instagram', label: 'Instagram Feed' },
    { id: 'chatbot', label: 'TMW Chatbot' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Section being edited or list of sections */}
      {activeSectionIndex !== null ? (
        <div className="flex-1 overflow-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Edit {sections[activeSectionIndex].type} Section</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                // First update the section with any changes
                updateSection(activeSectionIndex, {
                  ...sections[activeSectionIndex]
                });
                // Then clear the active section to go back to list view
                setActiveSectionIndex(null);
              }}
            >
              Back to List
            </Button>
          </div>
          <SectionEditor 
            section={sections[activeSectionIndex]}
            updateSection={(updatedSection) => updateSection(activeSectionIndex, updatedSection)}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="p-4 border-b">
            <h3 className="font-medium mb-2">Add Sections</h3>
            <div className="grid grid-cols-2 gap-2">
              {sectionTypes.map((type) => (
                <Button 
                  key={type.id}
                  variant="outline" 
                  size="sm"
                  className="justify-start overflow-hidden"
                  onClick={() => addSection(type.id)}
                >
                  <Plus className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{type.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-medium mb-2">Your Sections</h3>
            {sections.length === 0 ? (
              <p className="text-sm text-gray-500">No sections added yet. Add your first section above.</p>
            ) : (
              <div className="space-y-2">
                {sections.map((section, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-2 border rounded-md hover:bg-gray-50"
                  >
                    <Button 
                      variant="ghost" 
                      className="flex justify-start items-center gap-2 h-auto p-2 text-left hover:bg-transparent"
                      onClick={() => setActiveSectionIndex(index)}
                    >
                      <Layout className="h-4 w-4" />
                      <div>
                        <p className="font-medium capitalize">{section.type}</p>
                        <p className="text-xs text-gray-500 truncate">{section.title}</p>
                      </div>
                    </Button>
                    <div className="flex items-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => moveSectionUp(index)}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => moveSectionDown(index)}
                        disabled={index === sections.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500" 
                        onClick={() => removeSection(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionsTab;
