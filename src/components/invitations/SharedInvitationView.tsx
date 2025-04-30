
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SimpleInvitation } from '@/types/invitation.types';
import { getSharedInvitation } from '@/services/invitation/simple-invitations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, MapPin } from 'lucide-react';
import { formatLocation, generateDirectionsUrl } from '@/utils/locationUtils';

export default function SharedInvitationView() {
  const { shareId } = useParams<{ shareId: string }>();
  const [invitation, setInvitation] = useState<SimpleInvitation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInvitation = async () => {
      if (!shareId) {
        setError('Invalid invitation link');
        setIsLoading(false);
        return;
      }

      try {
        const data = await getSharedInvitation(shareId);
        if (data) {
          setInvitation(data);
        } else {
          setError('Invitation not found or no longer available');
        }
      } catch (err) {
        console.error('Error loading invitation:', err);
        setError('Failed to load invitation');
      } finally {
        setIsLoading(false);
      }
    };

    loadInvitation();
  }, [shareId]);

  const getBackgroundStyle = () => {
    if (!invitation?.customization?.background) {
      return '#ffffff';
    }

    const { type, value } = invitation.customization.background;
    
    if (type === 'image') {
      return `url(${value})`;
    } else if (type === 'gradient') {
      return value || 'linear-gradient(to right, #ee9ca7, #ffdde1)';
    }
    
    return value || '#ffffff';
  };

  const formatDate = (dateStr?: string, timeStr?: string) => {
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr);
      const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      });
      
      if (timeStr) {
        return `${formattedDate} at ${formatTime(timeStr)}`;
      }
      return formattedDate;
    } catch (e) {
      return dateStr;
    }
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '';
    
    try {
      const [hours, minutes] = timeStr.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      
      return date.toLocaleTimeString([], { 
        hour: 'numeric', 
        minute: '2-digit' 
      });
    } catch (e) {
      return timeStr;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Invitation Not Found</h2>
            <p className="text-muted-foreground mb-4">
              {error || 'This invitation may have been removed or is no longer available.'}
            </p>
            <Button asChild>
              <a href="/">Go Home</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const font = invitation.customization.font || {
    family: 'system-ui, sans-serif',
    size: 'medium',
    color: '#000000',
  };

  const containerStyle = {
    backgroundColor: invitation.customization.background.type === 'solid' 
      ? invitation.customization.background.value 
      : 'transparent',
    backgroundImage: invitation.customization.background.type !== 'solid'
      ? getBackgroundStyle()
      : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  };
  
  // Add semi-transparent overlay for better text readability on image backgrounds
  const overlayStyle = invitation.customization.background.type === 'image' ? {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 0,
  } : {};

  const contentStyle = {
    position: 'relative' as const,
    zIndex: 1,
    maxWidth: '800px',
    width: '100%',
  };

  const cardStyle = {
    fontFamily: font.family,
    color: invitation.customization.background.type === 'image' 
      ? '#ffffff'  // Use white text on image backgrounds
      : font.color || '#000000',
    textAlign: font.alignment as any || 'left',
  };

  return (
    <div style={containerStyle}>
      {invitation.customization.background.type === 'image' && <div style={overlayStyle}></div>}
      
      <div style={contentStyle}>
        <Card className={`
          w-full shadow-lg overflow-hidden p-8
          ${invitation.customization.background.type === 'image' ? 'bg-black/30 backdrop-blur-sm border-white/20' : ''}
        `}>
          <div style={cardStyle} className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {invitation.title}
              </h1>
              
              {invitation.date && (
                <div className="flex items-center gap-2 opacity-80 mb-4">
                  <CalendarIcon className="h-5 w-5" />
                  <span className="text-lg">
                    {formatDate(invitation.date, invitation.time)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="my-6">
              <p className="text-lg whitespace-pre-wrap">{invitation.description}</p>
            </div>
            
            {invitation.location && (
              <div className="mt-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                  <div>
                    {invitation.locationTitle && (
                      <p className="font-medium text-lg">{invitation.locationTitle}</p>
                    )}
                    <p className="opacity-80">{formatLocation(invitation.location)}</p>
                    
                    <div className="mt-4">
                      <Button 
                        className={`
                          ${invitation.customization.background.type === 'image' 
                            ? 'bg-white text-black hover:bg-white/90' 
                            : ''}
                        `}
                        asChild
                      >
                        <a 
                          href={generateDirectionsUrl(invitation.location)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Get Directions
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
        
        <div className="text-center mt-8 text-sm opacity-70">
          <p className={`${invitation.customization.background.type === 'image' ? 'text-white' : 'text-muted-foreground'}`}>
            Created with Wakti
          </p>
        </div>
      </div>
    </div>
  );
}
