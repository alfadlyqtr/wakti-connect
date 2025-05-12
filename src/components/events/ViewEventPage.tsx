
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Clock, ArrowLeft, Edit, Trash } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { format, parseISO } from 'date-fns';
import { Event } from '@/types/event.types';
import { supabase } from '@/integrations/supabase/client';
import { transformDatabaseEvent } from '@/services/event/eventHelpers';

interface ViewEventPageProps {
  eventId: string;
}

const ViewEventPage: React.FC<ViewEventPageProps> = ({ eventId }) => {
  const navigate = useNavigate();
  
  // Fetch event data
  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('Not authenticated');
        }
        
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();
          
        if (error) throw error;
        return transformDatabaseEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
        throw error;
      }
    },
  });

  const handleEdit = () => {
    navigate(`/dashboard/events/edit/${eventId}`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);
        
      if (error) throw error;
      
      toast({
        title: 'Event deleted',
        description: 'The event has been successfully deleted',
      });
      
      navigate('/dashboard/events');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete the event',
      });
    }
  };

  const handleBack = () => {
    navigate('/dashboard/events');
  };
  
  // Format date for display
  const formatEventDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'EEEE, MMMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Format time for display
  const formatEventTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'h:mm a');
    } catch (error) {
      return '';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !event) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The event you're looking for could not be found or you don't have permission to view it.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Extract customization for styling with proper null checks
  const customization = event.customization || {};
  const cardStyle: React.CSSProperties = {};
  
  // Apply background styling if available with proper null checks
  if (customization.background && customization.background.type) {
    if (customization.background.type === 'solid') {
      cardStyle.backgroundColor = customization.background.value || '#ffffff';
    } else if (customization.background.type === 'image' && customization.background.value) {
      cardStyle.backgroundImage = `url(${customization.background.value})`;
      cardStyle.backgroundSize = 'cover';
      cardStyle.backgroundPosition = 'center';
    }
  }
  
  // Apply text color if available with proper null checks
  if (customization.font && customization.font.color) {
    cardStyle.color = customization.font.color;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
      </div>
      
      <Card className="overflow-hidden shadow-lg" style={cardStyle}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
            <div className="flex space-x-2">
              <Button onClick={handleEdit} size="sm" variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button onClick={handleDelete} size="sm" variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {event.description && (
            <div className="text-lg">
              {event.description}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              <span>{formatEventDate(event.start_time)}</span>
            </div>
            
            {!event.is_all_day && (
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <span>
                  {formatEventTime(event.start_time)}
                  {event.end_time && ` - ${formatEventTime(event.end_time)}`}
                </span>
              </div>
            )}
            
            {event.location && (
              <div className="flex items-center col-span-1 md:col-span-2">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter>
          <div className="w-full flex justify-between">
            <div>
              {event.status === 'draft' && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                  Draft
                </span>
              )}
              {event.status === 'published' && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                  Published
                </span>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              Created: {format(parseISO(event.created_at), 'MMM d, yyyy')}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ViewEventPage;
