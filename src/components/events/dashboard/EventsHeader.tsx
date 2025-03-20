
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface EventsHeaderProps {
  showCreateForm: boolean;
  onCreateEvent: () => void;
}

const EventsHeader: React.FC<EventsHeaderProps> = ({ 
  showCreateForm, 
  onCreateEvent 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-xl sm:text-2xl font-bold">Events</h1>
      {!showCreateForm && (
        <Button onClick={onCreateEvent} size={isMobile ? "sm" : "default"}>
          <Plus className="h-4 w-4 mr-1 sm:mr-2" /> {isMobile ? "Create" : "Create Event"}
        </Button>
      )}
    </div>
  );
};

export default EventsHeader;
