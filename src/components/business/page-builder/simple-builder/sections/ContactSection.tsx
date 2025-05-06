
import React from "react";
import { SectionType } from "../types";
import { Button } from "@/components/ui/button";

interface ContactSectionProps {
  section: SectionType;
  isActive: boolean;
  onClick: () => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({ section, isActive, onClick }) => {
  // Placeholder for a contact section
  return (
    <div 
      className={`relative transition-all ${isActive ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-300'}`}
      onClick={onClick}
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-4 text-center">{section.title}</h2>
        <p className="text-gray-600 mb-8 text-center">{section.subtitle}</p>
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <input 
              type="text" 
              placeholder="Name" 
              className="w-full p-2 border border-gray-300 rounded"
              disabled={true}
            />
          </div>
          <div className="mb-4">
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full p-2 border border-gray-300 rounded"
              disabled={true}
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Message"
              rows={5}
              className="w-full p-2 border border-gray-300 rounded"
              disabled={true}
            ></textarea>
          </div>
          <Button className="w-full">Send</Button>
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

export default ContactSection;
