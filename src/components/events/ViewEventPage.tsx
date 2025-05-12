
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Event, EventCustomization } from '@/types/event.types';
import { format } from 'date-fns';
import { CalendarCheck, MapPin, Send, Share2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { sendEventInvitation, getEventInvitations } from '@/services/invitation/invitationService';
import { initialCustomization } from '@/components/events/customize/initial-customization';
import { toast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ViewEventPageProps {
  eventId: string;
}

const ViewEventPage: React.FC<ViewEventPageProps> = ({ eventId }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  
  // Load event data
  const { data: eventData, isLoading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
      
      if (error) throw error;
      return data as Event;
    }
  });
  
  // Load invitations
  const { data: invitationsData } = useQuery({
    queryKey: ['event-invitations', eventId],
    queryFn: async () => {
      return await getEventInvitations(eventId);
    },
    enabled: !!eventId
  });
  
  // Update state when data is loaded
  useEffect(() => {
    if (eventData) {
      setEvent(eventData);
    }
  }, [eventData]);
  
  useEffect(() => {
    if (invitationsData) {
      setInvitations(invitationsData);
    }
  }, [invitationsData]);
  
  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const success = await sendEventInvitation(eventId, email);
      
      if (success) {
        setEmail('');
        // Refetch invitations
        // queryClient.invalidateQueries(['event-invitations', eventId]);
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Failed to send invitation",
        description: "There was an error sending the invitation",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]">Loading event...</div>;
  }
  
  if (error || !event) {
    return <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <p className="text-lg text-red-500 mb-4">Error loading event</p>
      <Button onClick={() => navigate('/dashboard/events')}>Back to Events</Button>
    </div>;
  }
  
  // Safely access customization with fallbacks to initialCustomization
  const customization = event.customization || initialCustomization;
  
  // Background style
  const getBackgroundStyle = () => {
    if (!customization.background) {
      return { background: initialCustomization.background.value };
    }

    const { type, value } = customization.background;
    
    if (type === 'image') {
      return { backgroundImage: `url(${value})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    
    return { background: value || initialCustomization.background.value };
  };
  
  // Font style
  const getFontStyle = () => {
    if (!customization.font) {
      return {
        fontFamily: initialCustomization.font.family,
        color: initialCustomization.font.color,
        fontSize: initialCustomization.font.size
      };
    }

    return {
      fontFamily: customization.font.family || initialCustomization.font.family,
      color: customization.font.color || initialCustomization.font.color,
      fontSize: customization.font.size || initialCustomization.font.size
    };
  };
  
  // Format date for display
  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'EEEE, MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };
  
  // Format time for display
  const formatEventTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'h:mm a');
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/events')}
          className="flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Events
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Preview */}
        <Card 
          className="col-span-2 overflow-hidden" 
          style={{ ...getBackgroundStyle(), ...getFontStyle(), padding: '2rem' }}
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <p className="opacity-80">
              {formatEventDate(event.start_time)}
              {!event.is_all_day && ` • ${formatEventTime(event.start_time)}`}
            </p>
          </div>
          
          {event.description && (
            <div className="mb-6">
              <p className="whitespace-pre-line">{event.description}</p>
            </div>
          )}
          
          {event.location && (
            <div className="flex items-start mb-6">
              <MapPin className="mr-2 mt-1 flex-shrink-0" size={18} />
              <div>
                {event.location_title && <p className="font-medium">{event.location_title}</p>}
                <p>{event.location}</p>
              </div>
            </div>
          )}
          
          <div className="flex gap-3 mt-6">
            <Button className="flex items-center">
              <CalendarCheck size={18} className="mr-2" />
              Add to Calendar
            </Button>
            
            <Button variant="outline" className="flex items-center">
              <Share2 size={18} className="mr-2" />
              Share
            </Button>
            
            {/* Edit button */}
            <Button 
              variant="secondary" 
              onClick={() => navigate(`/dashboard/events/edit/${eventId}`)}
            >
              Edit Event
            </Button>
          </div>
        </Card>
        
        {/* Invitation Section */}
        <div className="col-span-1">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Invite People</h2>
            
            <form onSubmit={handleSendInvitation} className="mb-6">
              <div className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex mt-1">
                  <Input 
                    id="email"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="rounded-r-none"
                  />
                  <Button type="submit" className="rounded-l-none flex items-center">
                    <Send size={16} className="mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </form>
            
            <div>
              <h3 className="font-medium mb-2">Sent Invitations</h3>
              {invitations.length === 0 ? (
                <p className="text-gray-500">No invitations sent yet</p>
              ) : (
                <ul className="space-y-2">
                  {invitations.map((invitation) => (
                    <li 
                      key={invitation.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span>{invitation.email}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {invitation.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewEventPage;
