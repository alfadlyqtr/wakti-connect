
import React from "react";
import { SectionType } from "../types";

interface HeaderSectionProps {
  section: SectionType;
  isActive: boolean;
  onClick: () => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ section, isActive, onClick }) => {
  const { title, subtitle, content } = section;
  const { logoUrl, alignment = "center" } = content;
  
  // Convert alignment to Tailwind classes
  const alignmentClass = 
    alignment === "left" ? "text-left items-start" : 
    alignment === "right" ? "text-right items-end" : 
    "text-center items-center";
  
  return (
    <div
      className={`p-8 transition-all ${isActive ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-300'}`}
      onClick={onClick}
    >
      <div className={`flex flex-col ${alignmentClass}`}>
        {logoUrl && (
          <div className="mb-4">
            <img 
              src={logoUrl} 
              alt="Business Logo" 
              className="h-20 w-auto object-contain" 
            />
          </div>
        )}
        
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        {subtitle && <p className="text-xl text-gray-600">{subtitle}</p>}
      </div>
      
      {isActive && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
          Editing
        </div>
      )}
    </div>
  );
};

export default HeaderSection;
