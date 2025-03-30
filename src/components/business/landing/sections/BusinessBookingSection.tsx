
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/formatUtils";
import { BookingModalContent } from "../booking";
import { fetchPublishedBookingTemplates } from "@/services/booking/templates/fetchTemplates";
import { BookingTemplateWithRelations } from "@/types/booking.types";

// Function to format duration from minutes to hours and minutes
const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min`;
};

interface BusinessBookingSectionProps {
  content: Record<string, any>;
  businessId: string;
}

const BusinessBookingSection: React.FC<BusinessBookingSectionProps> = ({ 
  content, 
  businessId 
}) => {
  const [templates, setTemplates] = useState<BookingTemplateWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  const {
    title = "Our Services",
    subtitle = "Book your appointment today",
    description = "Browse our services and book your appointment online",
    buttonText = "Book Now",
    showPrice = true,
    showDuration = true,
    showDescription = true,
    displayAsCards = true,
    displayAs = "grid",  // grid, list, carousel
    selectedTemplates = [], // Array of template IDs to display
    buttonColor,
    buttonTextColor
  } = content;
  
  // Fetch published templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setIsLoading(true);
        const fetchedTemplates = await fetchPublishedBookingTemplates(businessId);
        
        // Filter by selected templates if provided
        const filteredTemplates = selectedTemplates.length > 0 
          ? fetchedTemplates.filter(t => selectedTemplates.includes(t.id))
          : fetchedTemplates;
          
        setTemplates(filteredTemplates);
        setError(null);
      } catch (err) {
        console.error("Error fetching templates:", err);
        setError(err instanceof Error ? err : new Error("Failed to load booking templates"));
      } finally {
        setIsLoading(false);
      }
    };
    
    if (businessId) {
      loadTemplates();
    }
  }, [businessId, selectedTemplates]);
  
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || templates.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {subtitle && <p className="text-lg mb-2">{subtitle}</p>}
        <p className="text-muted-foreground">No services available for booking at this time.</p>
      </div>
    );
  }
  
  // Determine grid layout based on displayAs setting
  const gridLayout = 
    displayAs === "list" ? "grid grid-cols-1 gap-6" : 
    displayAs === "carousel" ? "flex overflow-x-auto pb-4 space-x-6 snap-x" :
    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"; // default grid
  
  // Custom styling for template cards
  const cardClass = displayAsCards ? "overflow-hidden transition-all hover:shadow-md" : "border-0 shadow-none";
  
  // Custom styling for book now button
  const buttonStyle = {
    backgroundColor: buttonColor || undefined,
    color: buttonTextColor || undefined
  };
  
  return (
    <section className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        {subtitle && <p className="text-xl mb-2">{subtitle}</p>}
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      
      <div className={gridLayout}>
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className={cardClass}
            style={displayAs === "carousel" ? { minWidth: "300px", scrollSnapAlign: "start" } : undefined}
          >
            <CardHeader className="pb-2">
              <h3 className="text-xl font-bold">{template.name}</h3>
            </CardHeader>
            
            <CardContent className="pb-2">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  {showDuration && template.duration && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      {formatDuration(template.duration)}
                    </div>
                  )}
                  
                  {showPrice && template.price && (
                    <div className="text-lg font-semibold">
                      {formatCurrency(template.price)}
                    </div>
                  )}
                </div>
                
                {showDescription && template.description && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      {template.description}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="pt-2">
              <Button 
                className="w-full" 
                style={buttonStyle}
                onClick={() => {
                  setSelectedTemplateId(template.id);
                  setShowBookingModal(true);
                }}
              >
                {buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.description || "Book your appointment"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTemplate && (
            <BookingModalContent 
              template={selectedTemplate} 
              businessId={businessId}
              onClose={() => setShowBookingModal(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default BusinessBookingSection;
