
import React from "react";
import { EditorProps } from "../types";
import GalleryHeaderSection from "./GalleryHeaderSection";
import GalleryTemplateSection from "./GalleryTemplateSection";
import GalleryUploadSection from "./GalleryUploadSection";
import GalleryImagesGrid from "./GalleryImagesGrid";

const GalleryEditor: React.FC<EditorProps> = ({ contentData, handleInputChange }) => {
  // Ensure we have default data structure
  const images = contentData.images || [];
  
  return (
    <div className="space-y-4">
      {/* Gallery title and layout options */}
      <GalleryHeaderSection 
        contentData={contentData} 
        handleInputChange={handleInputChange} 
      />
      
      {/* Template selection section */}
      <GalleryTemplateSection 
        contentData={contentData}
        handleInputChange={handleInputChange}
      />
      
      {/* Image upload section */}
      <GalleryUploadSection 
        images={images}
        handleInputChange={handleInputChange}
      />
      
      {/* Display uploaded images grid */}
      {images.length > 0 && (
        <GalleryImagesGrid 
          images={images}
          handleInputChange={handleInputChange}
        />
      )}
    </div>
  );
};

export default GalleryEditor;
