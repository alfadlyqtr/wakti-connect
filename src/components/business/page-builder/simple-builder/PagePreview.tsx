
import React from "react";
import { SectionType, PageSettings, BusinessPageData } from "./types";
import HeaderSection from "./sections/HeaderSection";
import BookingSection from "./sections/BookingSection";
import SocialSection from "./sections/SocialSection";
import ChatbotSection from "./sections/ChatbotSection";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PagePreviewProps {
  sections?: SectionType[];
  activeSection?: SectionType;
  activeSectionIndex?: number | null;
  setActiveSectionIndex?: (index: number | null) => void;
  addSection?: (type: string) => void;
  pageSettings?: PageSettings;
  pageData?: BusinessPageData;
  isEditMode?: boolean;
}

const PagePreview: React.FC<PagePreviewProps> = ({ 
  sections, 
  activeSection, 
  activeSectionIndex, 
  setActiveSectionIndex,
  addSection,
  pageSettings,
  pageData,
  isEditMode = true
}) => {
  // If we have pageData, render the new style preview
  if (pageData && !isEditMode) {
    return (
      <div 
        className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm overflow-auto h-full"
        style={{
          fontFamily: pageSettings?.fontFamily || 'system-ui',
          color: pageSettings?.textColor || '#000000',
          backgroundColor: pageSettings?.backgroundColor || '#ffffff'
        }}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center">
            {pageData.pageSetup.businessName || "Business Name"}
          </h1>
          {pageData.pageSetup.description && (
            <p className="text-center mt-2 text-gray-600">
              {pageData.pageSetup.description}
            </p>
          )}
          
          {pageData.logo.visible && pageData.logo.url && (
            <div className="flex justify-center my-6">
              <img 
                src={pageData.logo.url} 
                alt="Business Logo" 
                className={`h-24 object-contain ${pageData.logo.shape === 'circle' ? 'rounded-full' : 'rounded'}`}
              />
            </div>
          )}
          
          {/* More sections could be added here based on pageData */}
        </div>
      </div>
    );
  }
  
  // Original logic for edit mode with sections
  const renderSection = (section: SectionType, index: number) => {
    if (!setActiveSectionIndex) return null;
    
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
        fontFamily: pageSettings?.fontFamily || 'system-ui',
        color: pageSettings?.textColor || '#000000',
        backgroundColor: pageSettings?.backgroundColor || '#ffffff'
      }}
    >
      {/* Live preview of the page */}
      {sections && (
        <div className="divide-y">
          {sections.map((section, index) => (
            <div key={section.id} className="relative">
              {renderSection(section, index)}
            </div>
          ))}
        </div>
      )}
      
      {/* Add section button */}
      {addSection && (
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
              <Button variant="outline" size="sm" onClick={() => addSection("social")}>
                <Plus className="h-4 w-4 mr-1" /> Social
              </Button>
              <Button variant="outline" size="sm" onClick={() => addSection("chatbot")}>
                <Plus className="h-4 w-4 mr-1" /> Chatbot
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagePreview;
