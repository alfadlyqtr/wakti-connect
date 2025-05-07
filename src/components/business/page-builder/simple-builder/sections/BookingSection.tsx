
import React, { useState, useEffect } from "react";
import { SectionType } from "../types";
import { useBookingTemplates } from "@/hooks/useBookingTemplates";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingTemplateCard } from "../../components/BookingTemplateCard";

interface BookingSectionProps {
  section: SectionType;
  isActive: boolean;
  onClick: () => void;
}

const BookingSection: React.FC<BookingSectionProps> = ({ section, isActive, onClick }) => {
  // Extract content from section or use defaults
  const {
    title = "Our Services",
    subtitle = "Book your appointment today",
    description = "Browse our services and book an appointment online.",
    backgroundColor = "#ffffff",
    textColor = "#000000",
    textAlignment = "center"
  } = section.content || {};

  // Get business ID (mock implementation for now)
  const [businessId, setBusinessId] = useState<string | null>(null);
  
  // Get booking templates
  const { templates, isLoading, error } = useBookingTemplates(businessId || "");

  // Effect to simulate getting the business ID
  useEffect(() => {
    // In a real implementation, you would get this from context or auth
    const mockBusinessId = "mock-business-id"; // Replace with actual business ID in production
    setBusinessId(mockBusinessId);
  }, []);

  const sectionStyles: React.CSSProperties = {
    backgroundColor: backgroundColor || "#ffffff",
    color: textColor || "#000000",
    textAlign: textAlignment === "left" ? "left" : 
              textAlignment === "right" ? "right" : "center" as any,
    padding: "2rem 1rem"
  };

  const handleBookingClick = (templateId: string) => {
    // In a real implementation, open booking dialog or redirect to booking page
    console.log("Booking clicked for template:", templateId);
    window.open(`/booking/${businessId}/${templateId}`, '_blank');
  };

  return (
    <div 
      className={`relative rounded-lg overflow-hidden transition-all duration-200 ${isActive ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}
      style={sectionStyles}
      onClick={onClick}
    >
      <div className="container mx-auto max-w-5xl">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">{title}</h2>
          {subtitle && <p className="text-xl">{subtitle}</p>}
          {description && <p className="text-muted-foreground mb-8">{description}</p>}
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Failed to load services</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  // Reload booking templates
                }}
              >
                Retry
              </Button>
            </div>
          ) : templates && templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => (
                <div 
                  key={template.id} 
                  className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookingClick(template.id);
                  }}
                >
                  <BookingTemplateCard 
                    template={template} 
                    preview={false} 
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p>No services available for booking</p>
              {isActive && (
                <p className="text-sm text-muted-foreground mt-2">
                  Add booking services in the Bookings tab to display them here
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {isActive && (
        <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none"></div>
      )}
    </div>
  );
};

export default BookingSection;
