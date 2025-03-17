
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Plus } from "lucide-react";
import ServiceCard from "./ServiceCard";
import { Service } from "@/types/service.types";

interface ServiceListProps {
  services: Service[];
  searchQuery: string;
  isLoading: boolean;
  error: Error | null;
  onAddService: () => void;
  onEditService: (service: Service) => void;
  onDeleteService: (id: string) => void;
  isDeleting: boolean;
}

const ServiceList: React.FC<ServiceListProps> = ({ 
  services, 
  searchQuery,
  isLoading, 
  error, 
  onAddService, 
  onEditService, 
  onDeleteService,
  isDeleting
}) => {
  // Filter services based on search query
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Error loading services</p>
      </div>
    );
  }

  if (filteredServices.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <DollarSign className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Services</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "No services match your search." : "You haven't added any services yet."}
          </p>
          <Button onClick={onAddService}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredServices.map((service) => (
        <ServiceCard 
          key={service.id} 
          service={service} 
          onEdit={onEditService} 
          onDelete={onDeleteService}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
};

export default ServiceList;
