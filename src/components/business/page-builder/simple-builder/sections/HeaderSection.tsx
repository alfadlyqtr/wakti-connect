
import React from "react";
import { SectionType } from "../types";

interface HeaderSectionProps {
  section: SectionType;
  isActive: boolean;
  onClick: () => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ section, isActive, onClick }) => {
  const renderLayout = () => {
    // Extract layout from section content or use default
    const layout = section.content?.layout || section.activeLayout || "default";
    
    // Get text content with proper fallbacks
    const title = section.content?.title || section.title || "Welcome to our business";
    const subtitle = section.content?.subtitle || section.subtitle || "Book our services online";
    const description = section.content?.description || section.description || "";
    
    // Get background image
    const backgroundImage = section.content?.backgroundImageUrl || section.image || "";
    const backgroundColor = section.content?.backgroundColor || "#f3f4f6";
    
    switch (layout) {
      case "centered":
        return (
          <div className="text-center py-20 px-4">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-xl mb-8">{subtitle}</p>
            {description && (
              <p className="text-lg max-w-3xl mx-auto">{description}</p>
            )}
          </div>
        );
      case "split":
        return (
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-8 flex items-center justify-center">
              <div>
                <h1 className="text-3xl font-bold mb-4">{title}</h1>
                <p className="text-xl mb-4">{subtitle}</p>
                {description && (
                  <p className="text-base">{description}</p>
                )}
              </div>
            </div>
            <div className="flex-1 bg-gray-200 min-h-[300px] flex items-center justify-center">
              {backgroundImage ? (
                <img 
                  src={backgroundImage} 
                  alt={title || "Header"} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-500">Header Image</div>
              )}
            </div>
          </div>
        );
      default: // default overlay layout
        return (
          <div 
            className="relative min-h-[400px] flex items-center justify-center p-8 bg-center bg-cover"
            style={{ 
              backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
              backgroundColor: backgroundImage ? undefined : backgroundColor
            }}
          >
            <div className={`absolute inset-0 ${backgroundImage ? 'bg-black/50' : ''}`}></div>
            <div className="relative z-10 text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
              <p className="text-xl md:text-2xl mb-4">{subtitle}</p>
              {description && (
                <p className="text-lg max-w-3xl mx-auto">{description}</p>
              )}
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

export default HeaderSection;
