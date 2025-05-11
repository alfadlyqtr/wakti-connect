import React from "react";
import { Button } from "@/components/ui/button";
import { SectionType } from "@/types/business.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Layout, Image, MapPin, FileText, Star, Calendar, Instagram, MessageCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AddSectionButtonsProps {
  onAddSection: (sectionType: SectionType) => void;
  isCreating: boolean;
}

const sectionCategories = {
  "basic": [
    { type: "header" as SectionType, icon: Layout, title: "Header", description: "Add a header with a title, subtitle, and call-to-action" },
    { type: "about" as SectionType, icon: FileText, title: "About", description: "Share information about your business" },
    { type: "contact" as SectionType, icon: MapPin, title: "Contact", description: "Add your contact information and location" },
  ],
  "advanced": [
    { type: "gallery" as SectionType, icon: Image, title: "Gallery", description: "Showcase photos in a grid layout" },
    { type: "testimonials" as SectionType, icon: Star, title: "Testimonials", description: "Show customer reviews and testimonials" },
  ],
  "integration": [
    { type: "booking" as SectionType, icon: Calendar, title: "Booking Templates", description: "Display your booking services" },
    { type: "instagram" as SectionType, icon: Instagram, title: "Instagram Feed", description: "Embed your Instagram posts" },
    { type: "chatbot" as SectionType, icon: MessageCircle, title: "TMW AI Chatbot", description: "Add an AI chatbot to your page" },
  ]
};

const AddSectionButtons: React.FC<AddSectionButtonsProps> = ({ onAddSection, isCreating }) => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="basic">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="basic" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sectionCategories.basic.map((section) => (
              <SectionCard
                key={section.type}
                section={section}
                onAddSection={onAddSection}
                isCreating={isCreating}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sectionCategories.advanced.map((section) => (
              <SectionCard
                key={section.type}
                section={section}
                onAddSection={onAddSection}
                isCreating={isCreating}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="integration" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sectionCategories.integration.map((section) => (
              <SectionCard
                key={section.type}
                section={section}
                onAddSection={onAddSection}
                isCreating={isCreating}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface SectionCardProps {
  section: {
    type: SectionType;
    icon: React.ElementType;
    title: string;
    description: string;
  };
  onAddSection: (sectionType: SectionType) => void;
  isCreating: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({ section, onAddSection, isCreating }) => {
  const Icon = section.icon;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all h-full flex flex-col">
      <CardHeader className="pb-2">
        <Icon className="h-8 w-8 text-primary mb-2" />
        <CardTitle className="text-lg">{section.title}</CardTitle>
        <CardDescription className="text-xs">{section.description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto pt-2">
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full"
          onClick={() => onAddSection(section.type)}
          disabled={isCreating}
        >
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddSectionButtons;
