
import React from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Edit, Trash2 } from "lucide-react";
import { Service } from "@/types/service.types";
import { useIsMobile } from "@/hooks/use-mobile";

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  isDeleting: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  onEdit, 
  onDelete,
  isDeleting
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg md:text-xl">{service.name}</CardTitle>
          {service.price && (
            <Badge variant="secondary" className="ml-2 font-semibold">
              QAR {service.price.toFixed(2)}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2 text-sm md:text-base">
          {service.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow space-y-4">
        <div className="flex items-center text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-sm md:text-base">{service.duration} minutes</span>
        </div>
      </CardContent>
      
      <CardFooter className={`flex ${isMobile ? "flex-col" : "justify-between"} pt-4 border-t gap-2`}>
        <Button 
          variant="outline" 
          size={isMobile ? "default" : "sm"} 
          onClick={() => onEdit(service)}
          className={isMobile ? "w-full" : ""}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button 
          variant="destructive" 
          size={isMobile ? "default" : "sm"} 
          onClick={() => onDelete(service)}
          disabled={isDeleting}
          className={isMobile ? "w-full" : ""}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
