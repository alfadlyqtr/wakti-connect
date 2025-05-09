
import React from "react";
import { SectionType } from "../types";

interface HoursSectionProps {
  section: SectionType;
  isActive: boolean;
  onClick: () => void;
}

const HoursSection: React.FC<HoursSectionProps> = ({ section, isActive, onClick }) => {
  const defaultHours = [
    { day: "Monday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Tuesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Wednesday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Thursday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Friday", hours: "9:00 AM - 5:00 PM", isOpen: true },
    { day: "Saturday", hours: "10:00 AM - 3:00 PM", isOpen: true },
    { day: "Sunday", hours: "Closed", isOpen: false }
  ];

  return (
    <div 
      className={`relative transition-all ${isActive ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-300'}`}
      onClick={onClick}
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-4 text-center">{section.title}</h2>
        <p className="text-gray-600 mb-8 text-center">{section.subtitle}</p>
        
        <div className="max-w-md mx-auto">
          {defaultHours.map((item, index) => (
            <div 
              key={index} 
              className="flex justify-between py-2 border-b"
            >
              <div className="font-medium">{item.day}</div>
              <div>{item.hours}</div>
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

export default HoursSection;
