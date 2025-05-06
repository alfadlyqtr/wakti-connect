
import React from "react";
import { SectionType } from "../types";

interface AboutSectionProps {
  section: SectionType;
  isActive: boolean;
  onClick: () => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({ section, isActive, onClick }) => {
  const renderLayout = () => {
    switch (section.activeLayout) {
      case "right-image":
        return (
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-8">
              <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
              <p className="text-gray-600">{section.content.description}</p>
            </div>
            <div className="flex-1 bg-gray-200 min-h-[300px] flex items-center justify-center">
              {section.image ? (
                <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-500">Image</div>
              )}
            </div>
          </div>
        );
      case "centered":
        return (
          <div className="text-center p-8 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
            <div className="mb-6">
              {section.image ? (
                <img src={section.image} alt={section.title} className="w-48 h-48 object-cover mx-auto rounded-full" />
              ) : (
                <div className="w-48 h-48 bg-gray-200 mx-auto rounded-full flex items-center justify-center">
                  <span className="text-gray-500">Image</span>
                </div>
              )}
            </div>
            <p className="text-gray-600">{section.content.description}</p>
          </div>
        );
      default: // left-image layout
        return (
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 bg-gray-200 min-h-[300px] flex items-center justify-center">
              {section.image ? (
                <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-500">Image</div>
              )}
            </div>
            <div className="flex-1 p-8">
              <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
              <p className="text-gray-600">{section.content.description}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className={`relative transition-all ${isActive ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-300'}`}
      onClick={onClick}
    >
      {renderLayout()}
      {isActive && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
          Editing
        </div>
      )}
    </div>
  );
};

export default AboutSection;
