
import React from "react";
import { BookingTemplateWithRelations } from "@/types/booking.types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, DollarSign } from "lucide-react";
import { formatCurrency } from "@/utils/formatUtils";

interface BookingTemplateCardProps {
  template: BookingTemplateWithRelations;
  preview?: boolean;
  onClick?: () => void;
  showDuration?: boolean;
  showPrice?: boolean;
  showDescription?: boolean;
}

export const BookingTemplateCard: React.FC<BookingTemplateCardProps> = ({
  template,
  preview = false,
  onClick,
  showDuration = true,
  showPrice = true,
  showDescription = true
}) => {
  return (
    <Card className={`w-full ${!preview ? 'hover:shadow-md transition-all' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle>{template.name}</CardTitle>
        {showDescription && template.description && (
          <CardDescription>{template.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {showDuration && (
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{template.duration} minutes</span>
            </div>
          )}
          
          {template.service && (
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{template.service.name}</span>
            </div>
          )}
          
          {showPrice && template.price !== null && (
            <div className="flex items-center text-sm font-medium">
              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{formatCurrency(template.price)}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      {!preview && (
        <CardFooter>
          <Button className="w-full" onClick={onClick}>
            Book Now
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
