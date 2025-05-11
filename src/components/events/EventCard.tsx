
import React from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ribbon } from "@/components/ui/ribbon";
import { CalendarDays, MapPin, ArrowRight, Clock, Users, Calendar } from "lucide-react";
import { generateDirectionsUrl } from "@/utils/locationUtils";

interface EventCardProps {
  title: string;
  description: string;
  date: Date;
  location: string;
  isFree?: boolean;
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  description,
  date,
  location,
  isFree = true,
  onClick,
}) => {
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Card className="bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col space-y-1">
          <h4 className="text-sm font-semibold">{title}</h4>
          <div className="flex items-center text-xs text-muted-foreground space-x-2">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
            <Clock className="h-3 w-3" />
            <span>{formattedTime}</span>
          </div>
        </div>
        {isFree && <Ribbon text="Free" />}
      </CardHeader>
      <CardContent className="py-2 text-sm text-muted-foreground">
        {description}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center text-xs text-muted-foreground space-x-2">
          <MapPin className="h-3 w-3" />
          <span>{location}</span>
        </div>
        <Button size="sm" variant="outline" onClick={onClick}>
          View More <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
