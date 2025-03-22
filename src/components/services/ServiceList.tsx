
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Service } from '@/hooks/useServiceQueries';
import ServiceCard from './ServiceCard';

interface ServiceListProps {
  services: Service[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ServiceList: React.FC<ServiceListProps> = ({
  services,
  isLoading,
  error,
  onEdit,
  onDelete
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
        <CardContent className="py-6 text-center">
          <h3 className="font-semibold text-red-600 dark:text-red-400">Error Loading Services</h3>
          <p className="text-sm text-red-500 dark:text-red-300">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (services.length === 0) {
    return (
      <Card className="border-dashed border-2 bg-muted/50">
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold mb-2">No services found</h3>
          <p className="text-muted-foreground mb-4">
            Create your first service to start receiving bookings
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          id={service.id}
          name={service.name}
          description={service.description}
          price={service.price}
          duration={service.duration}
          status={service.status}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
