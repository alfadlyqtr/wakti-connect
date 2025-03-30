
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { useBookingTemplates } from "@/hooks/useBookingTemplates";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, Calendar, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/formatUtils";
import BookingModalContent from "../booking";

// Function to format duration from minutes to hours and minutes
const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min`;
};

interface BusinessBookingTemplatesSectionProps {
  content: Record<string, any>;
  businessId: string;
}

const BusinessBookingTemplatesSection: React.FC<BusinessBookingTemplatesSectionProps> = ({ 
  content, 
  businessId 
}) => {
  const { templates, isLoading, error } = useBookingTemplates(businessId);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  const {
    title = "Our Services",
    subtitle = "Book your appointment today",
    description = "Browse our services and book your appointment online"
  } = content;
  
  const selectedTemplate = templates?.find(t => t.id === selectedTemplateId);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !templates || templates.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {subtitle && <p className="text-lg mb-2">{subtitle}</p>}
        <p className="text-muted-foreground">No services available for booking at this time.</p>
      </div>
    );
  }
  
  return (
    <section className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        {subtitle && <p className="text-xl mb-2">{subtitle}</p>}
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <h3 className="text-xl font-bold">{template.name}</h3>
            </CardHeader>
            
            <CardContent className="pb-2">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    {formatDuration(template.duration)}
                  </div>
                  
                  {template.price && (
                    <div className="text-lg font-semibold">
                      {formatCurrency(template.price)}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  {template.description && (
                    <div className="text-sm text-muted-foreground">
                      {template.description}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-2">
              <Button 
                className="w-full" 
                onClick={() => {
                  setSelectedTemplateId(template.id);
                  setShowBookingModal(true);
                }}
              >
                Book Now
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
          
          {selectedTemplateId && (
            <BookingModalContent 
              templateId={selectedTemplateId} 
              businessId={businessId}
              onSuccess={() => setShowBookingModal(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default BusinessBookingTemplatesSection;
