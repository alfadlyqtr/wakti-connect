
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessPageSection } from "@/types/business.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface BusinessServicesListProps {
  section: BusinessPageSection;
  businessId: string;
}

interface BusinessService {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number | null;
}

const BusinessServicesList = ({ section, businessId }: BusinessServicesListProps) => {
  const navigate = useNavigate();
  const content = section.section_content || {};
  
  const {
    title = "Our Services",
    description = "Book our professional services online",
    showPrices = true,
    showDuration = true
  } = content;
  
  // Fetch services for this business
  const { data: services, isLoading } = useQuery({
    queryKey: ['businessServices', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_services')
        .select('*')
        .eq('business_id', businessId);
      
      if (error) {
        console.error("Error fetching business services:", error);
        throw error;
      }
      
      return data as BusinessService[];
    }
  });
  
  const handleBookService = (serviceId: string) => {
    navigate(`/book/${serviceId}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!services || services.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        <div className="text-center py-8 border rounded-lg">
          <p className="text-muted-foreground">No services available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              {service.description && (
                <CardDescription>{service.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {showDuration && service.duration && (
                  <p className="text-sm">
                    <span className="font-medium">Duration:</span> {service.duration} minutes
                  </p>
                )}
                {showPrices && service.price !== null && (
                  <p className="text-lg font-bold">
                    QAR {service.price.toFixed(2)}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleBookService(service.id)}>
                Book Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BusinessServicesList;
