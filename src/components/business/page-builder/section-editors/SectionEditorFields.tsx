
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

  // Create adapter function that handles both event-based and name/value based inputs
  const handleInputChange = (nameOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value?: any) => {
    if (typeof nameOrEvent === 'string') {
      updateContentField(nameOrEvent, value);
    } else {
      updateContentField(nameOrEvent.target.name, nameOrEvent.target.value);
    }
  };
  
  const renderEditorFields = () => {
    switch (section.section_type) {
      case 'header':
        return <HeaderEditor contentData={contentData} handleInputChange={handleInputChange} />;
        
      case 'contact':
        return <ContactEditor 
          data={contentData} 
          onChange={(updatedData) => {
            Object.keys(updatedData).forEach(key => {
              updateContentField(key, updatedData[key]);
            });
          }} 
        />;
        
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
