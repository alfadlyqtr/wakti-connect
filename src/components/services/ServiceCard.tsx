
import React from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Edit, Trash2 } from "lucide-react";
import { Service } from "@/types/service.types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";

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
  const { formatCurrency } = useCurrencyFormat({ businessId: service.business_id });
  
  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg md:text-xl">{service.name}</CardTitle>
          {service.price && (
            <Badge variant="secondary" className="ml-2 font-semibold text-base md:text-sm whitespace-nowrap">
              {formatCurrency(service.price)}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2 text-base md:text-sm mt-1">
          {service.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow space-y-4">
        <div className="flex items-center text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-base md:text-sm">{service.duration} minutes</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between pt-4 border-t gap-3 sm:gap-2">
        <Button 
          variant="outline" 
          onClick={() => onEdit(service)}
          className="w-full h-12 text-base sm:h-10 sm:text-sm"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button 
          variant="destructive" 
          onClick={() => onDelete(service)}
          disabled={isDeleting}
          className="w-full h-12 text-base sm:h-10 sm:text-sm"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
