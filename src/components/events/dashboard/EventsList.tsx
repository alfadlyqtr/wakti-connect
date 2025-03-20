
import React from "react";
import { Event, EventTab } from "@/types/event.types";
import EventCard from "@/components/events/EventCard";

interface EventsListProps {
  events: Event[];
  viewType: 'grid' | 'list';
  activeTab: EventTab;
  isLoading: boolean;
  onCardClick?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  onEdit?: (event: Event) => void;
  onViewResponses?: (eventId: string) => void;
  onAccept?: (eventId: string) => void;
  onDecline?: (eventId: string) => void;
}

const EventsList: React.FC<EventsListProps> = ({
  events,
  viewType,
  activeTab,
  isLoading,
  onCardClick,
  onDelete,
  onEdit,
  onViewResponses,
  onAccept,
  onDecline
}) => {
  if (isLoading) {
    return <div className="text-center py-6 sm:py-10">Loading {activeTab.replace('-', ' ')}...</div>;
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-6 sm:py-10">
        <p className="text-muted-foreground text-sm sm:text-base">No {activeTab.replace('-', ' ')} found</p>
        {activeTab === "my-events" && (
          <Button 
            variant="link" 
            className="mt-2"
            onClick={() => onEdit && onEdit({} as Event)}
          >
            Create your first event
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={
      viewType === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4" 
        : "space-y-3 sm:space-y-4"
    }>
      {events.map((event) => (
        <EventCard 
          key={event.id} 
          event={event} 
          viewType={activeTab === "my-events" ? "sent" : activeTab === "invited-events" ? "received" : "draft"}
          onCardClick={onCardClick ? () => onCardClick(event) : undefined}
          onDelete={onDelete}
          onEdit={onEdit ? () => onEdit(event) : undefined}
          onViewResponses={onViewResponses}
          onAccept={onAccept}
          onDecline={onDecline}
        />
      ))}
    </div>
  );
};

// Missing import
import { Button } from "@/components/ui/button";

export default EventsList;
