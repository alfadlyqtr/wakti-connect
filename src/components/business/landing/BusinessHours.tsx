
import React from "react";
import { BusinessPageSection } from "@/types/business.types";
import { Card, CardContent } from "@/components/ui/card";

interface BusinessHoursProps {
  section: BusinessPageSection;
}

const BusinessHours = ({ section }: BusinessHoursProps) => {
  const content = section.section_content || {};
  
  const { 
    title = "Business Hours",
    description = "When you can visit us",
    hours = [
      { day: "Monday", hours: "9:00 AM - 5:00 PM" },
      { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
      { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
      { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
      { day: "Friday", hours: "9:00 AM - 5:00 PM" },
      { day: "Saturday", hours: "10:00 AM - 3:00 PM" },
      { day: "Sunday", hours: "Closed" }
    ],
    showCurrentDay = true,
    layout = "grid" // or "list"
  } = content;
  
  // Determine current day
  const getCurrentDay = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = days[new Date().getDay()];
    return today;
  };
  
  const currentDay = getCurrentDay();
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>
        
        {layout === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {hours.map((item, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  showCurrentDay && item.day === currentDay 
                    ? "bg-primary/10 border-primary" 
                    : "bg-card"
                }`}
              >
                <div className="font-semibold">{item.day}</div>
                <div className="mt-1">{item.hours}</div>
                {showCurrentDay && item.day === currentDay && (
                  <div className="mt-2 text-xs font-medium text-primary">
                    Today
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-0">
                {hours.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex justify-between p-4 ${
                      index < hours.length - 1 ? "border-b" : ""
                    } ${
                      showCurrentDay && item.day === currentDay 
                        ? "bg-primary/10" 
                        : ""
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
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default BusinessHours;
