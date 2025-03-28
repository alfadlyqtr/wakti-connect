
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingTemplateWithRelations } from "@/types/booking.types";
import { formatCurrency } from "@/utils/formatUtils";
import { Clock } from "lucide-react";

interface BookingTemplateCardProps {
  template: BookingTemplateWithRelations;
  preview?: boolean;
}

export const BookingTemplateCard: React.FC<BookingTemplateCardProps> = ({ template, preview = false }) => {
  return preview ? (
    <div className="space-y-1">
      <h3 className="text-base font-medium">{template.name}</h3>
      {template.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
      )}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>{template.duration} min</span>
        </div>
        {template.price !== null && (
          <div>{formatCurrency(template.price)}</div>
        )}
      </div>
    </div>
  ) : (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{template.name}</CardTitle>
        {template.description && (
          <CardDescription>{template.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{template.duration} minutes</span>
          </div>
          {template.price !== null && (
            <div className="font-medium">{formatCurrency(template.price)}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
