
import React from "react";
import { BusinessPageSection } from "@/types/business.types";
import { BusinessHours as BusinessHoursType } from "@/hooks/useBusinessHours";
import { WorkingHour } from "@/types/business-settings.types";

interface BusinessHoursProps {
  section: BusinessPageSection;
  businessHours?: BusinessHoursType | null;
}

const BusinessHours = ({ section, businessHours }: BusinessHoursProps) => {
  const content = section.section_content || {};
  
  // Format time from 24h format to 12h format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  // Convert database working hours to display format
  const convertHoursToDisplayFormat = (workingHours: WorkingHour[]) => {
    return workingHours.map(hour => ({
      day: hour.day,
      hours: hour.closed ? 'Closed' : `${formatTime(hour.open)} - ${formatTime(hour.close)}`
    }));
  };
  
  // Use business hours from database if available, otherwise fall back to section content
  const {
    title = "Business Hours",
    showCurrentDay = true
  } = content;
  
  // Determine which hours data to use (from database or fallback)
  const hours = businessHours?.hours && businessHours.hours.length > 0
    ? convertHoursToDisplayFormat(businessHours.hours)
    : (content.hours || [
        { day: "Monday", hours: "9:00 AM - 5:00 PM" },
        { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
        { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
        { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
        { day: "Friday", hours: "9:00 AM - 5:00 PM" },
        { day: "Saturday", hours: "10:00 AM - 3:00 PM" },
        { day: "Sunday", hours: "Closed" }
    ]);
  
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
