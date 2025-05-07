
import React from "react";
import { SectionType, PageSettings } from "./types";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeaderSection from "./sections/HeaderSection";
import AboutSection from "./sections/AboutSection";
import GallerySection from "./sections/GallerySection";
import ContactSection from "./sections/ContactSection";
import HoursSection from "./sections/HoursSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import BookingSection from "./sections/BookingSection";
import InstagramSection from "./sections/InstagramSection";
import ChatbotSection from "./sections/ChatbotSection";

interface PagePreviewProps {
  sections: SectionType[];
  activeSectionIndex: number | null;
  setActiveSectionIndex: (index: number | null) => void;
  pageSettings: PageSettings;
  addSection: (type: string) => void;
  activeSection?: SectionType;
  onSectionClick?: (index: number) => void;
}

const PagePreview: React.FC<PagePreviewProps> = ({
  sections,
  activeSectionIndex,
  setActiveSectionIndex,
  pageSettings,
  addSection,
  activeSection,
  onSectionClick
}) => {
  // Function to render the appropriate section component based on type
  const renderSection = (section: SectionType, index: number) => {
    const isActive = activeSectionIndex === index;
    const commonProps = {
      section,
      isActive,
      onClick: () => {
        if (onSectionClick) {
          onSectionClick(index);
        } else {
          setActiveSectionIndex(index);
        }
      }
    };

    switch (section.type) {
      case 'header':
        return <HeaderSection key={index} {...commonProps} />;
      case 'about':
        return <AboutSection key={index} {...commonProps} />;
      case 'gallery':
        return <GallerySection key={index} {...commonProps} />;
      case 'contact':
        return <ContactSection key={index} {...commonProps} />;
      case 'hours':
        return <HoursSection key={index} {...commonProps} />;
      case 'testimonials':
        return <TestimonialsSection key={index} {...commonProps} />;
      case 'booking':
        return <BookingSection key={index} {...commonProps} />;
      case 'instagram':
        return <InstagramSection key={index} {...commonProps} />;
      case 'chatbot':
        return <ChatbotSection key={index} {...commonProps} />;
      default:
        return null;
    }
  };
  
  // Apply page-level styling based on pageSettings
  const pageStyle = {
    fontFamily: pageSettings.fontFamily || 'Inter, sans-serif',
    color: pageSettings.textColor || '#000000',
    backgroundColor: pageSettings.backgroundColor || '#ffffff'
  };

  return (
    <div className="max-w-4xl mx-auto" style={pageStyle}>
      {/* Add section button at the top */}
      <div className="flex justify-center my-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => {
            // Show dropdown with section options
            const sectionTypes = [
              "header", "about", "gallery", "contact", 
              "hours", "testimonials", "booking", 
              "instagram", "chatbot"
            ];
            
            const sectionType = prompt(
              "Choose a section type: " + sectionTypes.join(", ")
            );
            
            if (sectionType && sectionTypes.includes(sectionType)) {
              addSection(sectionType);
            }
          }}
        >
          <PlusCircle className="h-4 w-4" />
          Add Section
        </Button>
      </div>
      
      {/* Render all sections */}
      <div className="space-y-8">
        {sections.map((section, index) => (
          <div key={index} className="relative">
            {renderSection(section, index)}
            
            {/* Add section button between sections */}
            <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 z-10">
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full h-8 w-8 p-0 bg-white shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  const sectionTypes = [
                    "header", "about", "gallery", "contact", 
                    "hours", "testimonials", "booking", 
                    "instagram", "chatbot"
                  ];
                  
                  const sectionType = prompt(
                    "Choose a section type: " + sectionTypes.join(", ")
                  );
                  
                  if (sectionType && sectionTypes.includes(sectionType)) {
                    addSection(sectionType);
                  }
                }}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add section button at the bottom if no sections */}
      {sections.length === 0 && (
        <div className="flex flex-col items-center justify-center bg-gray-50 p-12 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">Your page is empty. Add your first section to get started.</p>
          <Button 
            variant="default" 
            className="flex items-center gap-2"
            onClick={() => {
              const sectionTypes = [
                "header", "about", "gallery", "contact", 
                "hours", "testimonials", "booking", 
                "instagram", "chatbot"
              ];
              
              const sectionType = prompt(
                "Choose a section type: " + sectionTypes.join(", ")
              );
              
              if (sectionType && sectionTypes.includes(sectionType)) {
                addSection(sectionType);
              }
            }}
          >
            <PlusCircle className="h-4 w-4" />
            Add First Section
          </Button>
        </div>
      )}
    </div>
  );
};

export default PagePreview;
