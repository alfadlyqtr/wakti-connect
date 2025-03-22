
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

export const ServiceList: React.FC = () => {
  // This would normally use a data fetching hook
  const services = [
    { id: '1', name: 'Service 1', description: 'Description for service 1', price: 50, duration: 60 },
    { id: '2', name: 'Service 2', description: 'Description for service 2', price: 75, duration: 90 },
    { id: '3', name: 'Service 3', description: 'Description for service 3', price: 100, duration: 120 },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.length === 0 ? (
        <Card className="col-span-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No services created yet.</p>
          </CardContent>
        </Card>
      ) : (
        services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
              <div className="flex justify-between text-sm">
                <span>${service.price.toFixed(2)}</span>
                <span>{service.duration} minutes</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};
