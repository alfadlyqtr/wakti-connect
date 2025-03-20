
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Event } from "@/types/event.types";

interface EventResponsesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEventId: string | null;
  events: Event[];
}

const EventResponsesDialog: React.FC<EventResponsesDialogProps> = ({
  open,
  onOpenChange,
  selectedEventId,
  events
}) => {
  // Get responses for the selected event
  const getEventResponses = () => {
    if (!selectedEventId) return { accepted: [], declined: [], pending: [] };
    
    const event = events.find(e => e.id === selectedEventId);
    if (!event?.invitations) return { accepted: [], declined: [], pending: [] };
    
    return {
      accepted: event.invitations.filter(inv => inv.status === 'accepted'),
      declined: event.invitations.filter(inv => inv.status === 'declined'),
      pending: event.invitations.filter(inv => inv.status === 'pending')
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Event Responses</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium flex items-center gap-2">
              <span className="text-green-500">✓</span> Accepted ({getEventResponses().accepted.length})
            </h3>
            <ul className="mt-2 space-y-1">
              {getEventResponses().accepted.map(inv => (
                <li key={inv.id} className="text-sm">
                  {inv.email || 'User #' + inv.invited_user_id?.slice(0, 8)}
                </li>
              ))}
              {getEventResponses().accepted.length === 0 && (
                <li className="text-sm text-muted-foreground">No acceptances yet</li>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium flex items-center gap-2">
              <span className="text-red-500">✗</span> Declined ({getEventResponses().declined.length})
            </h3>
            <ul className="mt-2 space-y-1">
              {getEventResponses().declined.map(inv => (
                <li key={inv.id} className="text-sm">
                  {inv.email || 'User #' + inv.invited_user_id?.slice(0, 8)}
                </li>
              ))}
              {getEventResponses().declined.length === 0 && (
                <li className="text-sm text-muted-foreground">No declines</li>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium flex items-center gap-2">
              <span className="text-yellow-500">⏱</span> Pending ({getEventResponses().pending.length})
            </h3>
            <ul className="mt-2 space-y-1">
              {getEventResponses().pending.map(inv => (
                <li key={inv.id} className="text-sm">
                  {inv.email || 'User #' + inv.invited_user_id?.slice(0, 8)}
                </li>
              ))}
              {getEventResponses().pending.length === 0 && (
                <li className="text-sm text-muted-foreground">No pending responses</li>
              )}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventResponsesDialog;
