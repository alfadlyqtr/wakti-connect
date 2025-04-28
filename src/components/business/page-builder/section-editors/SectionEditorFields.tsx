
import React from "react";
import { useSectionEditor } from "@/hooks/useSectionEditor";
import HeaderEditor from "./HeaderEditor";
import ContactEditor from "./ContactEditor";
import HoursEditor from "./HoursEditor";
import AboutEditor from "./AboutEditor";
import DefaultEditor from "./DefaultEditor";
import GalleryEditor from "./gallery";
import BookingTemplateSection from "../sections/BookingTemplateSection";
import InstagramFeedSection from "../sections/InstagramFeedSection";
import TestimonialsEditor from "./TestimonialsEditor";
import ChatbotSection from "../sections/ChatbotSection";

const SectionEditorFields: React.FC = () => {
  const { section, contentData, updateContentField } = useSectionEditor();

  // Create adapter function that converts from event-based to name/value based
  const handleInputChange = (name: string, value: any) => {
    updateContentField(name, value);
  };
  
  const renderEditorFields = () => {
    switch (section.section_type) {
      case 'header':
        return <HeaderEditor contentData={contentData} handleInputChange={handleInputChange} />;
        
      case 'contact':
        return <ContactEditor contentData={contentData} handleInputChange={handleInputChange} />;
        
      case 'hours':
        return <HoursEditor contentData={contentData} handleInputChange={handleInputChange} />;
        
      case 'about':
        return <AboutEditor contentData={contentData} handleInputChange={handleInputChange} />;
        
      case 'gallery':
        return <GalleryEditor contentData={contentData} handleInputChange={handleInputChange} />;
        
      case 'booking':
        return <BookingTemplateSection />;
        
      case 'instagram':
        return <InstagramFeedSection />;
        
      case 'chatbot':
        return <ChatbotSection />;
        
      case 'testimonials':
        return <TestimonialsEditor contentData={contentData} handleInputChange={handleInputChange} />;
        
      default:
        return <DefaultEditor contentData={contentData} handleInputChange={handleInputChange} />;
    }
  };
  
  return <>{renderEditorFields()}</>;
};

export default SectionEditorFields;
