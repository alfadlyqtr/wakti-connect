
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event.types";
import { CalendarDays, Clock, MapPin, Users, Share2, Calendar, Edit, Trash2, Check, X } from "lucide-react";
import { formatDate, getRelativeDateLabel } from "@/utils/dateUtils";
import { formatLocation, generateMapsUrl } from "@/utils/locationUtils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EventDetailViewProps {
  event: Event;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
}

export const EventDetailView: React.FC<EventDetailViewProps> = ({ 
  event, 
  onClose,
  onEdit,
  onDelete,
  onAccept,
  onDecline
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const handleDelete = () => {
    setDeleteDialogOpen(false);
    onDelete?.();
  };
  
  const handleAddToCalendar = () => {
    // Create a calendar event URL (works with Google Calendar)
    const title = encodeURIComponent(event.title);
    const start = encodeURIComponent(event.start_time);
    const end = encodeURIComponent(event.end_time);
    const location = event.location ? encodeURIComponent(event.location) : '';
    const details = event.description ? encodeURIComponent(event.description) : '';
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };
  
  // Extract styling from event customization
  const backgroundStyle = event.customization?.background?.type === 'image'
    ? { backgroundImage: `url(${event.customization.background.value})` }
    : event.customization?.background?.type === 'gradient'
    ? { background: event.customization.background.value }
    : { backgroundColor: event.customization?.background?.value || '#ffffff' };
  
  const fontStyle = {
    fontFamily: event.customization?.font?.family || 'inherit',
    color: event.customization?.font?.color || 'inherit'
  };
  
  // Determine button visibility based on customization
  const showDeclineButton = event.customization?.buttons?.decline?.isVisible !== false;
  const acceptButtonStyle = event.customization?.buttons?.accept || { background: '#4f46e5', color: '#ffffff', shape: 'rounded' };
  const declineButtonStyle = event.customization?.buttons?.decline || { background: '#ef4444', color: '#ffffff', shape: 'rounded' };
  
  const getBorderRadiusClass = (shape: string) => {
    switch (shape) {
      case 'pill': return 'rounded-full';
      case 'square': return 'rounded-none';
      case 'rounded':
      default: return 'rounded-md';
    }
  };
  
  const acceptButtonClasses = `bg-[${acceptButtonStyle.background}] text-[${acceptButtonStyle.color}] ${getBorderRadiusClass(acceptButtonStyle.shape)}`;
  const declineButtonClasses = `bg-[${declineButtonStyle.background}] text-[${declineButtonStyle.color}] ${getBorderRadiusClass(declineButtonStyle.shape)}`;
  
  return (
    <>
      <Card className="overflow-hidden">
        <div
          className="h-40 bg-cover bg-center"
          style={backgroundStyle}
        />
        
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
              {getRelativeDateLabel(event.start_time)}
            </Badge>
          </div>
          <CardTitle style={fontStyle}>{event.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-start gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Date & Time</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(event.start_time)}
                  {!event.is_all_day && (
                    <> - {formatDate(event.end_time)}</>
                  )}
                  {event.is_all_day && (
                    <Badge variant="outline" className="ml-2 text-xs">All day</Badge>
                  )}
                </p>
              </div>
            </div>
            
            {event.location && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">
                    {event.location_title || "Location"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatLocation(event.location)}
                  </p>
                  
                  <Button 
                    variant="link" 
                    className="h-auto p-0 text-xs mt-1" 
                    onClick={() => window.open(generateMapsUrl(event.location), '_blank')}
                  >
                    View on map
                  </Button>
                </div>
              </div>
            )}
            
            {event.description && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm whitespace-pre-wrap">{event.description}</p>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {event.invitations?.length || 0} guests
              </span>
            </div>
            
            <div className="flex gap-2">
              {event.customization?.showAddToCalendarButton !== false && (
                <Button size="sm" variant="outline" onClick={handleAddToCalendar}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Add to Calendar
                </Button>
              )}
              
              <Button size="sm" variant="outline">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t bg-muted/20 flex justify-between">
          {onEdit && onDelete ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          ) : (
            event.customization?.showAcceptDeclineButtons !== false && (
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  style={{
                    backgroundColor: acceptButtonStyle.background,
                    color: acceptButtonStyle.color
                  }}
                  className={getBorderRadiusClass(acceptButtonStyle.shape)}
                  onClick={onAccept}
                >
                  <Check className="h-4 w-4 mr-2" />
                  {acceptButtonStyle.text || "Accept"}
                </Button>
                
                {showDeclineButton && (
                  <Button 
                    size="sm"
                    style={{
                      backgroundColor: declineButtonStyle.background,
                      color: declineButtonStyle.color
                    }}
                    className={getBorderRadiusClass(declineButtonStyle.shape)}
                    onClick={onDecline}
                  >
                    <X className="h-4 w-4 mr-2" />
                    {declineButtonStyle.text || "Decline"}
                  </Button>
                )}
              </div>
            )
          )}
          
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </CardFooter>
      </Card>
      
      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this event? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
