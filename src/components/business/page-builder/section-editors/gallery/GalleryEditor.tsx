
import React from "react";
import { EditorProps } from "../types";
import GalleryHeaderSection from "./GalleryHeaderSection";
import GalleryTemplateSection from "./GalleryTemplateSection";
import GalleryUploadSection from "./GalleryUploadSection";
import GalleryImagesGrid from "./GalleryImagesGrid";

const GalleryEditor: React.FC<EditorProps> = ({ contentData, handleInputChange }) => {
  // Ensure we have default data structure
  const images = contentData.images || [];
  
  // Adapter function for components that expect different signature
  const adaptInputChange = (nameOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value?: any) => {
    if (typeof nameOrEvent === 'string') {
      handleInputChange(nameOrEvent, value);
    } else {
      handleInputChange(nameOrEvent.target.name, nameOrEvent.target.value);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Gallery title and layout options */}
      <GalleryHeaderSection 
        contentData={contentData} 
        handleInputChange={adaptInputChange} 
      />
      
      {/* Template selection section */}
      <GalleryTemplateSection 
        contentData={contentData}
        handleInputChange={adaptInputChange}
      />
      
      {/* Image upload section */}
      <GalleryUploadSection 
        images={images}
        handleInputChange={adaptInputChange}
      />
      
      {/* Display uploaded images grid */}
      {images.length > 0 && (
        <GalleryImagesGrid 
          images={images}
          handleInputChange={adaptInputChange}
        />
      )}
    </div>
  );
};

export default GalleryEditor;
