
import React from "react";
import { BusinessPageSection } from "@/types/business.types";

interface BusinessHoursProps {
  section: BusinessPageSection;
}

const BusinessHours = ({ section }: BusinessHoursProps) => {
  const content = section.section_content || {};
  
  const {
    title = "Business Hours",
    hours = [
      { day: "Monday", hours: "9:00 AM - 5:00 PM" },
      { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
      { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
      { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
      { day: "Friday", hours: "9:00 AM - 5:00 PM" },
      { day: "Saturday", hours: "10:00 AM - 3:00 PM" },
      { day: "Sunday", hours: "Closed" }
    ],
    showCurrentDay = true
  } = content;
  
  // Determine current day
  const getCurrentDay = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = days[new Date().getDay()];
    return today;
  };
  
  const currentDay = getCurrentDay();
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      
      <div className="max-w-lg mx-auto">
        {hours.map((item: any, index: number) => (
          <div 
            key={index}
            className={`flex justify-between py-2 border-b border-gray-200 ${
              showCurrentDay && item.day === currentDay ? "bg-primary/10" : ""
            }`}
          >
            <div className="font-medium">{item.day}</div>
            <div className="flex items-center">
              <span>{item.hours}</span>
              {showCurrentDay && item.day === currentDay && (
                <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  Today
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessHours;
