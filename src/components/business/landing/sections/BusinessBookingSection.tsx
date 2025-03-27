
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { BookingTemplateWithRelations } from "@/types/booking.types";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BusinessBookingSectionProps {
  content: Record<string, any>;
  businessId: string;
}

const BusinessBookingSection: React.FC<BusinessBookingSectionProps> = ({
  content, 
  businessId
}) => {
  const navigate = useNavigate();
  const { 
    title = "Book Our Services",
    description = "Schedule an appointment with us online",
    selectedTemplates = [],
    showDuration = true,
    showPrice = true,
    showDescription = true,
    displayAsCards = true
  } = content;

  const { data: templates, isLoading } = useQuery({
    queryKey: ['business-booking-templates', businessId, selectedTemplates],
    queryFn: async () => {
      if (!selectedTemplates.length) return [];
      
      const { data, error } = await supabase
        .from('booking_templates')
        .select(`
          *,
          service:service_id (
            name,
            description,
            price
          ),
          staff:staff_assigned_id (
            name
          )
        `)
        .eq('business_id', businessId)
        .eq('is_published', true)
        .in('id', selectedTemplates);
        
      if (error) throw error;
      return data as BookingTemplateWithRelations[];
    },
    enabled: !!businessId && selectedTemplates.length > 0
  });

  if (!selectedTemplates.length) {
    return null; // Don't render if no templates are selected
  }

  const handleBookNow = (templateId: string) => {
    navigate(`/book/${businessId}/${templateId}`);
  };

  return (
    <section className="py-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className={`grid gap-6 ${displayAsCards ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {templates?.map((template) => (
            <div 
              key={template.id}
              className={displayAsCards ? 'animate-fade-in' : 'mb-6 border-b pb-6 animate-fade-in'}
            >
              {displayAsCards ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                    {showDescription && template.description && (
                      <p className="text-muted-foreground mb-4">{template.description}</p>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      {showDuration && (
                        <div className="flex items-center text-sm">
                          <span className="font-medium mr-2">Duration:</span>
                          <span>{template.duration} minutes</span>
                        </div>
                      )}
                      
                      {template.service && (
                        <div className="flex items-center text-sm">
                          <span className="font-medium mr-2">Service:</span>
                          <span>{template.service.name}</span>
                        </div>
                      )}
                      
                      {showPrice && template.price !== null && (
                        <div className="flex items-center text-sm">
                          <span className="font-medium mr-2">Price:</span>
                          <span>QAR {template.price.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => handleBookNow(template.id)}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{template.name}</h3>
                      {showDescription && template.description && (
                        <p className="text-muted-foreground mb-2">{template.description}</p>
                      )}
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {showDuration && (
                          <p>Duration: {template.duration} minutes</p>
                        )}
                        
                        {template.service && (
                          <p>Service: {template.service.name}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {showPrice && template.price !== null && (
                        <p className="text-lg font-bold mb-2">QAR {template.price.toFixed(2)}</p>
                      )}
                      
                      <Button 
                        size="sm"
                        onClick={() => handleBookNow(template.id)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default BusinessBookingSection;
