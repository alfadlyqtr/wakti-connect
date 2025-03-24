
import React from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Edit, Trash2, Users } from "lucide-react";
import { Service } from "@/types/service.types";
import StaffAssignmentButton from "./StaffAssignmentButton";

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
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
      
      <CardContent className="pb-2 flex-grow space-y-4">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{service.duration} minutes</span>
        </div>
        
        <StaffAssignmentButton 
          serviceId={service.id} 
          serviceName={service.name}
          staffCount={staffCount}
        />
        
        {staffCount > 0 && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Users className="h-3 w-3 mr-1" />
            <span>{staffCount} staff {staffCount === 1 ? 'member' : 'members'} assigned</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-4 border-t">
        <Button variant="outline" size="sm" onClick={() => onEdit(service)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onDelete(service)}
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
