
import React from 'react';

interface EventCardPreviewProps {
  title?: string;
  description?: string;
  location?: string;
  locationTitle?: string;
  date?: Date;
}

const EventCardPreview: React.FC<EventCardPreviewProps> = ({
  title,
  description,
  location,
  locationTitle,
  date
}) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm w-full bg-white">
      <p className="text-center text-muted-foreground text-sm">
        Event preview has been deprecated
      </p>
    </div>
  );
};

export default EventCardPreview;
