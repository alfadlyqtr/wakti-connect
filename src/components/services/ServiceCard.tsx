
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Users } from "lucide-react";
import { formatCurrency } from "@/utils/formatUtils";

interface ServiceCardProps {
  id: string;
  name: string;
  price: number;
  description: string;
  duration: number;
  status: "active" | "inactive";
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ServiceCard = ({
  id,
  name,
  price,
  description,
  duration,
  status,
  onEdit,
  onDelete
}: ServiceCardProps) => {
  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins} minutes`;
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}${minutes > 0 ? ` ${minutes} mins` : ''}`;
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{name}</CardTitle>
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {status === "active" ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="text-xl font-semibold">
            {formatCurrency(price)}
          </div>
          <div className="text-sm text-muted-foreground">
            Duration: {formatDuration(duration)}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {description}
          </p>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(id)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
