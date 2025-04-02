
import React from "react";
import { format } from "date-fns";

interface DetailsTabContentProps {
  title?: string;
  description?: string;
  selectedDate?: Date;
  location?: string;
  startTime?: string;
  endTime?: string;
}

const DetailsTabContent: React.FC<DetailsTabContentProps> = ({
  title,
  description,
  selectedDate,
  location,
  startTime,
  endTime
}) => {
  return (
    <div className="space-y-4 p-4">
      <div className="mb-4">
        <h3 className="font-medium text-lg">{title || "Untitled Event"}</h3>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      
      {selectedDate && (
        <div className="border-t pt-4">
          <p className="text-sm font-medium">Date & Time</p>
          <p className="text-muted-foreground">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
            {startTime && endTime && (
              <span> · {startTime} - {endTime}</span>
            )}
          </p>
        </div>
      )}
      
      {location && (
        <div className="border-t pt-4">
          <p className="text-sm font-medium">Location</p>
          <p className="text-muted-foreground">{location}</p>
        </div>
      )}
    </div>
  );
};

export default DetailsTabContent;
