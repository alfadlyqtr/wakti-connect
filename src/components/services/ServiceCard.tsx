
import React from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Edit, Trash2 } from "lucide-react";
import { Service } from "@/types/service.types";

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  staffCount?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  onEdit, 
  onDelete,
  isDeleting,
  staffCount = 0
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{service.name}</CardTitle>
          {service.price && (
            <Badge variant="secondary" className="ml-2">
              QAR {service.price.toFixed(2)}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {service.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex items-center mb-2">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{service.duration} minutes</span>
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{staffCount} staff assigned</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4 border-t">
        <Button variant="outline" size="sm" onClick={() => onEdit(service)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onDelete(service.id)}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
