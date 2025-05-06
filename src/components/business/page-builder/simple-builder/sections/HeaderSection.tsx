
import React from "react";
import { SectionType } from "../types";

interface HeaderSectionProps {
  section: SectionType;
  isActive: boolean;
  onClick: () => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ section, isActive, onClick }) => {
  const renderLayout = () => {
    switch (section.activeLayout) {
      case "centered":
        return (
          <div className="text-center py-20 px-4">
            <h1 className="text-4xl font-bold mb-4">{section.title}</h1>
            <p className="text-xl mb-8">{section.subtitle}</p>
          </div>
        );
      case "split":
        return (
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-8 flex items-center justify-center">
              <div>
                <h1 className="text-3xl font-bold mb-4">{section.title}</h1>
                <p className="text-xl">{section.subtitle}</p>
              </div>
            </div>
            <div className="flex-1 bg-gray-200 min-h-[300px] flex items-center justify-center">
              {section.image ? (
                <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-500">Header Image</div>
              )}
            </div>
          </div>
        );
      default: // default layout
        return (
          <div 
            className="relative min-h-[400px] flex items-center justify-center p-8 bg-center bg-cover"
            style={{ 
              backgroundImage: section.image ? `url(${section.image})` : undefined,
              backgroundColor: section.image ? undefined : '#f3f4f6'
            }}
          >
            <div className={`absolute inset-0 bg-black/50`}></div>
            <div className="relative z-10 text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{section.title}</h1>
              <p className="text-xl md:text-2xl">{section.subtitle}</p>
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
