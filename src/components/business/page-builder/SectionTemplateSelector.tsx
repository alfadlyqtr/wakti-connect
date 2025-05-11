
import React from "react";
import { SectionType } from "@/types/business.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// This is a simplified template selector to replace the existing one
// with 'hours' option removed

interface SectionTemplateSelectorProps {
  onSelect: (type: SectionType) => void;
  onCancel: () => void;
}

// Section type definitions mapped to display names and descriptions
const sectionTypeInfo: Record<SectionType, { name: string; description: string }> = {
  header: {
    name: "Header Section",
    description: "Add a header section with title and optional subtitle"
  },
  about: {
    name: "About Section",
    description: "Describe your business and services"
  },
  contact: {
    name: "Contact Section",
    description: "Add contact information and optionally a contact form"
  },
  gallery: {
    name: "Gallery Section",
    description: "Showcase your work with a photo gallery"
  },
  testimonials: {
    name: "Testimonials Section", 
    description: "Display customer reviews and testimonials"
  },
  booking: {
    name: "Booking Section",
    description: "Allow customers to book appointments"
  },
  instagram: {
    name: "Instagram Section",
    description: "Display your Instagram feed"
  },
  chatbot: {
    name: "Chatbot Section",
    description: "Add a chatbot to assist your visitors"
  }
};

// Order in which to display section types
const sectionTypeOrder: SectionType[] = [
  "header",
  "about",
  "gallery",
  "contact",
  "testimonials",
  "booking",
  "instagram",
  "chatbot"
];

const SectionTemplateSelector: React.FC<SectionTemplateSelectorProps> = ({ onSelect, onCancel }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-none p-4 border-b">
        <h2 className="text-lg font-semibold">Add New Section</h2>
        <p className="text-sm text-muted-foreground">
          Choose a section type to add to your page
        </p>
      </div>
      
      <ScrollArea className="flex-grow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectionTypeOrder.map((type) => {
            const info = sectionTypeInfo[type];
            
            return (
              <Card key={type} className="cursor-pointer hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{info.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <CardDescription>{info.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="secondary" 
                    className="w-full text-sm" 
                    size="sm" 
                    onClick={() => onSelect(type)}
                  >
                    Add This Section
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
      
      <div className="flex-none p-4 border-t">
        <Button variant="ghost" className="w-full" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default SectionTemplateSelector;
