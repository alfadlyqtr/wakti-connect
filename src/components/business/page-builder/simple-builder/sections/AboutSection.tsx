
import React from "react";
import { SectionType } from "../types";

interface AboutSectionProps {
  section: SectionType;
  isActive: boolean;
  onClick: () => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({ section, isActive, onClick }) => {
  const { title, subtitle, description, content = {}, activeLayout = "standard" } = section;
  
  const renderLayout = () => {
    switch (activeLayout) {
      case 'columns':
        return (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-medium mb-4">{title}</h3>
              <p className="text-gray-600 mb-4">{description}</p>
            </div>
            <div className="flex justify-center items-center">
              {section.backgroundImageUrl && (
                <img
                  src={section.backgroundImageUrl}
                  alt={title}
                  className="max-w-full h-auto rounded-lg"
                />
              )}
            </div>
          </div>
        );
      
      case 'image-left':
        return (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex justify-center items-center">
              {section.backgroundImageUrl && (
                <img
                  src={section.backgroundImageUrl}
                  alt={title}
                  className="max-w-full h-auto rounded-lg"
                />
              )}
            </div>
            <div>
              <h3 className="text-2xl font-medium mb-4">{title}</h3>
              <p className="text-gray-600 mb-4">{description}</p>
            </div>
          </div>
        );
      
      case 'image-right':
        return (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-medium mb-4">{title}</h3>
              <p className="text-gray-600 mb-4">{description}</p>
            </div>
            <div className="flex justify-center items-center">
              {section.backgroundImageUrl && (
                <img
                  src={section.backgroundImageUrl}
                  alt={title}
                  className="max-w-full h-auto rounded-lg"
                />
              )}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-medium mb-4">{title}</h3>
            <p className="text-gray-600 mb-6">{description}</p>
            {section.backgroundImageUrl && (
              <img
                src={section.backgroundImageUrl}
                alt={title}
                className="max-w-full h-auto rounded-lg mx-auto"
              />
            )}
          </div>
        );
    }
  };
  
  return (
    <div
      className={`p-8 transition-all ${isActive ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-300'}`}
      onClick={onClick}
    >
      <h2 className="text-3xl font-bold mb-4 text-center">{title}</h2>
      {subtitle && <p className="text-xl text-gray-600 mb-8 text-center">{subtitle}</p>}
      
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
