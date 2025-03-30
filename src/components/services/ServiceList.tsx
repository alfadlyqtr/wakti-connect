
import React from "react";
import { Service } from "@/types/service.types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, PencilIcon, Trash2Icon, Clock, Users } from "lucide-react";
import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ServiceListProps {
  services: Service[] | undefined;
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
  const { formatCurrency } = useCurrencyFormat();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive text-center">
          There was an error loading services. Please try again.
        </p>
        <Button onClick={onAddService}>Try Again</Button>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed rounded-lg">
        <Clock className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No services yet</h3>
        <p className="text-muted-foreground max-w-sm mb-4">
          Create your first service to offer to your customers.
        </p>
        <Button onClick={onAddService} className="mt-2">
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-280px)]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <ServiceCard 
            key={service.id} 
            service={service}
            onEdit={() => onEditService(service)}
            onDelete={() => onDeleteService(service)}
            isDeleting={isDeleting}
            formatCurrency={formatCurrency}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

interface ServiceCardProps {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  formatCurrency: (amount: number) => string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  onEdit, 
  onDelete, 
  isDeleting,
  formatCurrency
}) => {
  // Format duration to hours and minutes
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours} hr ${remainingMinutes} min` 
      : `${hours} hr`;
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold truncate">{service.name}</h3>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onEdit}
                className="h-8 w-8"
              >
                <PencilIcon className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onDelete}
                disabled={isDeleting}
                className="h-8 w-8 text-destructive hover:text-destructive/90"
              >
                <Trash2Icon className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
          
          {service.description && (
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
              {service.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mt-4">
            {service.price !== null && service.price !== undefined && (
              <Badge variant="outline" className="bg-primary/10">
                {formatCurrency(service.price)}
              </Badge>
            )}
            
            <Badge variant="outline" className="bg-secondary/10">
              <Clock className="mr-1 h-3 w-3" />
              {formatDuration(service.duration)}
            </Badge>
            
            {service.assigned_staff && service.assigned_staff.length > 0 && (
              <Badge variant="outline" className="bg-muted">
                <Users className="mr-1 h-3 w-3" />
                {service.assigned_staff.length} Staff
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceList;
