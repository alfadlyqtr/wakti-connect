
import React from "react";
import { SectionType } from "../types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Layout, 
  ChevronDown, 
  ChevronUp, 
  Trash2,
  Plus,
  ImageIcon,
  HomeIcon,
  InfoIcon,
  PhoneIcon,
  ClockIcon,
  MessageSquareQuote,
  CalendarIcon,
  Instagram,
  MessagesSquare
} from "lucide-react";
import SectionEditor from "./SectionEditor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

interface SectionTypeOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
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
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  
  const sectionTypes: SectionTypeOption[] = [
    { 
      id: 'header', 
      label: 'Header/Hero', 
      icon: <HomeIcon className="h-4 w-4" />,
      description: 'Add a prominent header section to your page'
    },
    { 
      id: 'about', 
      label: 'About Us', 
      icon: <InfoIcon className="h-4 w-4" />,
      description: 'Tell visitors about your business'
    },
    { 
      id: 'gallery', 
      label: 'Gallery', 
      icon: <ImageIcon className="h-4 w-4" />,
      description: 'Showcase your work with images'
    },
    { 
      id: 'contact', 
      label: 'Contact', 
      icon: <PhoneIcon className="h-4 w-4" />,
      description: 'Add contact information and a contact form'
    },
    { 
      id: 'hours', 
      label: 'Business Hours', 
      icon: <ClockIcon className="h-4 w-4" />,
      description: 'Display your business operating hours'
    },
    { 
      id: 'testimonials', 
      label: 'Testimonials', 
      icon: <MessageSquareQuote className="h-4 w-4" />,
      description: 'Show reviews and testimonials from your customers'
    },
    { 
      id: 'booking', 
      label: 'Booking', 
      icon: <CalendarIcon className="h-4 w-4" />,
      description: 'Allow visitors to book appointments'
    },
    { 
      id: 'instagram', 
      label: 'Instagram Feed', 
      icon: <Instagram className="h-4 w-4" />,
      description: 'Display your Instagram feed'
    },
    { 
      id: 'chatbot', 
      label: 'TMW Chatbot', 
      icon: <MessagesSquare className="h-4 w-4" />,
      description: 'Add an AI chatbot to your page'
    },
  ];

  const handleAddSectionClick = (type: string) => {
    addSection(type);
    setShowAddDialog(false);
  };

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
            <h3 className="font-medium mb-2">Add Section</h3>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="w-full" variant="default">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Section
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Section</DialogTitle>
                  <DialogDescription>
                    Choose a section type to add to your page.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-2 py-4">
                  {sectionTypes.map((type) => (
                    <Button 
                      key={type.id}
                      variant="outline" 
                      className="justify-start h-auto py-3 px-4 flex flex-col items-start gap-2"
                      onClick={() => handleAddSectionClick(type.id)}
                    >
                      <div className="flex items-center">
                        {type.icon}
                        <span className="ml-2 font-medium">{type.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground text-left">{type.description}</p>
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="p-4">
            <h3 className="font-medium mb-2">Your Sections</h3>
            {sections.length === 0 ? (
              <div className="text-center p-12 border-2 border-dashed rounded-md">
                <Layout className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-500 mt-2">No sections added yet.</p>
                <p className="text-sm text-gray-500">Add your first section using the button above.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sections.map((section, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50"
                  >
                    <Button 
                      variant="ghost" 
                      className="flex justify-start items-center gap-2 h-auto p-2 text-left hover:bg-transparent"
                      onClick={() => setActiveSectionIndex(index)}
                    >
                      <Layout className="h-4 w-4" />
                      <div>
                        <p className="font-medium capitalize">{section.type}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {section.title || `${section.type} Section`}
                        </p>
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
