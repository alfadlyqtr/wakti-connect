
import React from "react";

interface BusinessBookingSectionProps {
  content: Record<string, any>;
  businessId: string;
  primaryColor?: string;
}

const BusinessBookingSection: React.FC<BusinessBookingSectionProps> = ({ 
  content, 
  businessId,
  primaryColor
}) => {
  const { 
    title = "Book an Appointment",
    description = "Schedule a time to meet with us",
    buttonText = "View Available Times",
    buttonLink = "#",
    showServiceSelection = true,
    showStaffSelection = true,
    backgroundColor = "bg-background"
  } = content;

  // Create custom style for the button if primaryColor is provided
  const buttonStyle = primaryColor ? {
    backgroundColor: primaryColor,
    borderColor: primaryColor
  } : {};

  return (
    <section className={`py-12 md:py-16 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>
        
        <div className="max-w-2xl mx-auto bg-card p-6 rounded-lg shadow-sm border">
          <div className="space-y-6">
            {showServiceSelection && (
              <div>
                <label htmlFor="service" className="block text-sm font-medium mb-2">
                  Select a Service
                </label>
                <select 
                  id="service" 
                  className="w-full p-2 border rounded-md bg-background"
                  defaultValue=""
                >
                  <option value="" disabled>Choose a service...</option>
                  <option value="service1">Service 1</option>
                  <option value="service2">Service 2</option>
                  <option value="service3">Service 3</option>
                </select>
              </div>
            )}
            
            {showStaffSelection && (
              <div>
                <label htmlFor="staff" className="block text-sm font-medium mb-2">
                  Select a Staff Member
                </label>
                <select 
                  id="staff" 
                  className="w-full p-2 border rounded-md bg-background"
                  defaultValue=""
                >
                  <option value="" disabled>Choose a staff member...</option>
                  <option value="staff1">Staff Member 1</option>
                  <option value="staff2">Staff Member 2</option>
                  <option value="any">Any Available Staff</option>
                </select>
              </div>
            )}
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-2">
                Select a Date
              </label>
              <input 
                type="date" 
                id="date" 
                className="w-full p-2 border rounded-md bg-background"
              />
            </div>
            
            <a
              href={buttonLink}
              className="block w-full py-2 px-4 bg-primary text-primary-foreground text-center rounded-md hover:bg-primary/90 transition-colors"
              style={buttonStyle}
            >
              {buttonText}
            </a>
            
            <p className="text-xs text-muted-foreground text-center pt-4">
              You can reschedule or cancel your appointment up to 24 hours before your scheduled time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessBookingSection;
