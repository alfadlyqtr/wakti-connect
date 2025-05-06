
import React from "react";
import { SectionType } from "../types";

interface GallerySectionProps {
  section: SectionType;
  isActive: boolean;
  onClick: () => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({ section, isActive, onClick }) => {
  // Placeholder for a gallery section
  return (
    <div 
      className={`relative transition-all ${isActive ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-300'}`}
      onClick={onClick}
    >
      <div className="p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
        <p className="text-gray-600 mb-8">{section.subtitle}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-200 h-40 flex items-center justify-center">
              <span className="text-gray-500">Gallery image {i + 1}</span>
            </div>
          ))}
        </div>
      </div>
      {isActive && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
          Editing
        </div>
      )}
    </div>
  );
};

export default GallerySection;
