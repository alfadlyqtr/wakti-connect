
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingTemplateWithRelations } from "@/types/booking.types";
import { formatCurrency } from "@/utils/formatUtils";
import { Clock, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchPublishedBookingTemplates } from "@/services/booking/templates/fetchTemplates";

interface BusinessBookingTemplatesSectionProps {
  content: Record<string, any>;
  businessId: string;
}

const BusinessBookingTemplatesSection: React.FC<BusinessBookingTemplatesSectionProps> = ({ 
  content, 
  businessId 
}) => {
  const { 
    title = "Book an Appointment",
    description = "Schedule a time to meet with us",
    showPrice = true,
    showDuration = true,
    showDescription = true,
    displayAsCards = true,
    displayAs = "grid", // grid, carousel, list
    selectedTemplates = [], // ids of templates to display
  } = content;

  const navigate = useNavigate();
  const [templates, setTemplates] = useState<BookingTemplateWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookingTemplates = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPublishedBookingTemplates(businessId);
        
        // Filter templates if specific ones are selected
        let filteredTemplates = data;
        if (selectedTemplates && selectedTemplates.length > 0) {
          filteredTemplates = data.filter(template => 
            selectedTemplates.includes(template.id)
          );
        }
        
        setTemplates(filteredTemplates);
      } catch (err) {
        console.error("Error loading booking templates:", err);
        setError("Failed to load booking options");
      } finally {
        setIsLoading(false);
      }
    };

    if (businessId) {
      loadBookingTemplates();
    }
  }, [businessId, selectedTemplates]);

  const handleBookNow = (templateId: string) => {
    navigate(`/booking/${businessId}/${templateId}`);
  };

  if (isLoading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{description}</p>
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || templates.length === 0) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {error || "No booking options available at the moment."}
          </p>
        </div>
      </section>
    );
  }

  const renderGridLayout = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map(template => (
        <Card key={template.id} className="overflow-hidden h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">{template.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {showDescription && template.description && (
              <p className="text-muted-foreground mb-4">{template.description}</p>
            )}
            <div className="space-y-2">
              {showDuration && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{template.duration} minutes</span>
                </div>
              )}
              {showPrice && template.price !== null && (
                <div className="text-sm font-medium">
                  {formatCurrency(template.price)}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => handleBookNow(template.id)}
            >
              Book Now
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const renderListLayout = () => (
    <div className="space-y-4 max-w-3xl mx-auto">
      {templates.map(template => (
        <Card key={template.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{template.name}</h3>
                {showDescription && template.description && (
                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  {showDuration && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{template.duration} min</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {showPrice && template.price !== null && (
                  <div className="text-sm font-medium">
                    {formatCurrency(template.price)}
                  </div>
                )}
                <Button 
                  size="sm"
                  onClick={() => handleBookNow(template.id)}
                >
                  Book
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>
        
        {displayAs === "list" 
          ? renderListLayout() 
          : renderGridLayout()
        }
      </div>
    </section>
  );
};

export default BusinessBookingTemplatesSection;
