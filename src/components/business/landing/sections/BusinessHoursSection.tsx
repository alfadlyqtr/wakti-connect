
import React from "react";

interface BusinessHoursSectionProps {
  content: Record<string, any>;
}

const BusinessHoursSection: React.FC<BusinessHoursSectionProps> = ({ content }) => {
  const { 
    title = "Business Hours",
    description = "When you can find us",
    hours = [],
    note = ""
  } = content;
  
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // Default hours structure if not provided
  const businessHours = hours.length ? hours : daysOfWeek.map(day => ({
    day,
    isOpen: day !== "Sunday",
    openTime: "9:00 AM",
    closeTime: "5:00 PM"
  }));
  
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>
        
        <div className="max-w-xl mx-auto">
          <div className="bg-card rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              {businessHours.map((item, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <span className="font-medium">{item.day}</span>
                  <span className="text-muted-foreground">
                    {item.isOpen 
                      ? `${item.openTime} - ${item.closeTime}` 
                      : "Closed"}
                  </span>
                </div>
              ))}
            </div>
            
            {note && (
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground italic">{note}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessHoursSection;
