import React from "react";
import { SectionType } from "../types";

interface SectionEditorProps {
  section: SectionType;
  updateSection: (section: SectionType) => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section, updateSection }) => {
  // Default editor for all section types
  // In a more complete implementation, we would use different editors based on section.type
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSection({
      ...section,
      title: e.target.value
    });
  };
  
  const handleSubtitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSection({
      ...section,
      subtitle: e.target.value
    });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Section Title</label>
        <input 
          type="text" 
          value={section.title} 
          onChange={handleTitleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" 
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium">Section Subtitle</label>
        <input 
          type="text" 
          value={section.subtitle} 
          onChange={handleSubtitleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" 
        />
      </div>
      
      {/* Additional fields would be added here based on section type */}
    </div>
  );
};

export default SectionEditor;
