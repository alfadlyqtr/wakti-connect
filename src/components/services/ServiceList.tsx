
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Plus } from "lucide-react";
import ServiceCard from "./ServiceCard";
import { Service } from "@/types/service.types";

interface ServiceListProps {
  services: Service[];
  isLoading: boolean;
  error: Error | null;
  onAddService: () => void;
  onEditService: (service: Service) => void;
  onDeleteService: (service: Service) => void;
  isDeleting: boolean;
}

const ServiceList: React.FC<ServiceListProps> = ({ 
  services, 
  isLoading, 
  error, 
  onAddService, 
  onEditService, 
  onDeleteService,
  isDeleting
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Error loading services: {error.message}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent className="pt-6">
          <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Services</h3>
          <p className="text-muted-foreground mb-6">
            You haven't added any services yet.
          </p>
          <Button onClick={onAddService} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Service
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCard 
          key={service.id} 
          service={service} 
          onEdit={onEditService} 
          onDelete={() => onDeleteService(service)}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
};

export default ServiceList;
