
import React from "react";
import { SectionType } from "../types";

interface ChatbotSectionProps {
  section: SectionType;
  isActive: boolean;
  onClick: () => void;
}

const ChatbotSection: React.FC<ChatbotSectionProps> = ({ section, isActive, onClick }) => {
  return (
    <div 
      className={`relative transition-all ${isActive ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-300'}`}
      onClick={onClick}
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-4 text-center">{section.title}</h2>
        <p className="text-gray-600 mb-8 text-center">{section.subtitle}</p>
        
        <div className="max-w-xl mx-auto border rounded-lg p-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-2">TMW AI Chatbot will appear here</p>
            <p className="text-sm text-gray-400">Add your chatbot code in the Settings tab</p>
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

export default ChatbotSection;
