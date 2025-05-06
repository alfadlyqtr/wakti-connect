
import React from "react";
import { SectionType } from "../types";
import { Button } from "@/components/ui/button";

interface BookingSectionProps {
  section: SectionType;
  isActive: boolean;
  onClick: () => void;
}

const BookingSection: React.FC<BookingSectionProps> = ({ section, isActive, onClick }) => {
  return (
    <div 
      className={`relative transition-all ${isActive ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-300'}`}
      onClick={onClick}
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-4 text-center">{section.title}</h2>
        <p className="text-gray-600 mb-8 text-center">{section.subtitle}</p>
        
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg border shadow-sm">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select a Service</label>
            <select className="w-full p-2 border border-gray-300 rounded">
              <option value="" disabled selected>Choose a service...</option>
              <option value="service1">Service 1</option>
              <option value="service2">Service 2</option>
              <option value="service3">Service 3</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select a Staff Member</label>
            <select className="w-full p-2 border border-gray-300 rounded">
              <option value="" disabled selected>Choose a staff member...</option>
              <option value="staff1">Staff Member 1</option>
              <option value="staff2">Staff Member 2</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Select a Date</label>
            <input type="date" className="w-full p-2 border border-gray-300 rounded" />
          </div>
          
          <Button className="w-full">View Available Times</Button>
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

export default BookingSection;
