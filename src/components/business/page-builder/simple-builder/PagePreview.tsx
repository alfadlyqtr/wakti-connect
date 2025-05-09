
import React from "react";
import { SectionType, PageSettings } from "./types";
import HeaderSection from "./sections/HeaderSection";
import BookingSection from "./sections/BookingSection";
import HoursSection from "./sections/HoursSection";
import SocialSection from "./sections/SocialSection";
import ChatbotSection from "./sections/ChatbotSection";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PagePreviewProps {
  sections: SectionType[];
  activeSection?: SectionType;
  activeSectionIndex: number | null;
  setActiveSectionIndex: (index: number | null) => void;
  addSection: (type: string) => void;
  pageSettings: PageSettings;
}

const PagePreview: React.FC<PagePreviewProps> = ({ 
  sections, 
  activeSection, 
  activeSectionIndex, 
  setActiveSectionIndex,
  addSection,
  pageSettings
}) => {
  const renderSection = (section: SectionType, index: number) => {
    const isActive = activeSectionIndex === index;
    
    switch(section.type) {
      case "header":
        return <HeaderSection 
          section={section} 
          isActive={isActive} 
          onClick={() => setActiveSectionIndex(index)} 
        />;
      case "booking":
        return <BookingSection 
          section={section} 
          isActive={isActive} 
          onClick={() => setActiveSectionIndex(index)} 
        />;
      case "hours":
        return <HoursSection 
          section={section} 
          isActive={isActive} 
          onClick={() => setActiveSectionIndex(index)} 
        />;
      case "social":
        return <SocialSection 
          section={section} 
          isActive={isActive} 
          onClick={() => setActiveSectionIndex(index)} 
        />;
      case "chatbot":
        return <ChatbotSection 
          section={section} 
          isActive={isActive} 
          onClick={() => setActiveSectionIndex(index)} 
        />;
      default:
        return <div>Unknown section type</div>;
    }
  };
  
  return (
    <div 
      className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm"
      style={{
        fontFamily: pageSettings.fontFamily,
        color: pageSettings.textColor,
        backgroundColor: pageSettings.backgroundColor
      }}
    >
      {/* Live preview of the page */}
      <div className="divide-y">
        {sections.map((section, index) => (
          <div key={section.id} className="relative">
            {renderSection(section, index)}
          </div>
        ))}
      </div>
      
      {/* Add section button */}
      <div className="p-8 text-center border-t">
        <div className="inline-flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">Add a new section</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => addSection("header")}>
              <Plus className="h-4 w-4 mr-1" /> Header
            </Button>
            <Button variant="outline" size="sm" onClick={() => addSection("booking")}>
              <Plus className="h-4 w-4 mr-1" /> Booking
            </Button>
            <Button variant="outline" size="sm" onClick={() => addSection("hours")}>
              <Plus className="h-4 w-4 mr-1" /> Hours
            </Button>
            <Button variant="outline" size="sm" onClick={() => addSection("social")}>
              <Plus className="h-4 w-4 mr-1" /> Social
            </Button>
            <Button variant="outline" size="sm" onClick={() => addSection("chatbot")}>
              <Plus className="h-4 w-4 mr-1" /> Chatbot
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagePreview;
