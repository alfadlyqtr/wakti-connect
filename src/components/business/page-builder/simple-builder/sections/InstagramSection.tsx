
import React from "react";
import { SectionType } from "../types";
import { Instagram } from "lucide-react";

interface InstagramSectionProps {
  section: SectionType;
  isActive: boolean;
  onClick: () => void;
}

const InstagramSection: React.FC<InstagramSectionProps> = ({ section, isActive, onClick }) => {
  return (
    <div 
      className={`relative transition-all ${isActive ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-300'}`}
      onClick={onClick}
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-4 text-center">{section.title}</h2>
        <p className="text-gray-600 mb-8 text-center">{section.subtitle}</p>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <Instagram className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium">@yourbusiness</h3>
                <a 
                  href="#" 
                  className="text-blue-600 text-sm hover:underline"
                >
                  View Profile
                </a>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="aspect-square bg-gray-200 flex items-center justify-center">
                <Instagram className="h-8 w-8 text-gray-400" />
              </div>
            ))}
          </div>
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

export default InstagramSection;
