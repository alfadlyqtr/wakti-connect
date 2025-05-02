import React from 'react';
import { SimpleInvitationCustomization } from '@/types/invitation.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MapPin, Download, Calendar } from 'lucide-react';
import { formatLocation, generateDirectionsUrl } from '@/utils/locationUtils';
import { createGoogleCalendarUrl, createICSFile } from '@/utils/calendarUtils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface InvitationPreviewProps {
  title?: string;
  description?: string;
  location?: string;
  locationTitle?: string;
  date?: string;
  time?: string;
  customization: SimpleInvitationCustomization;
  showActions?: boolean;
  isEvent?: boolean;
}

export default function InvitationPreview({
  title = "Invitation Title",
  description = "Enter a description for your invitation.",
  location,
  locationTitle,
  date,
  time,
  customization,
  showActions = true,
  isEvent = false
}: InvitationPreviewProps) {
  
  const getBackgroundStyle = () => {
    if (!customization?.background) {
      return '#ffffff';
    }

    const { type, value } = customization.background;
    
    if (type === 'image') {
      return `url(${value})`;
    } else if (type === 'gradient') {
      return value || 'linear-gradient(to right, #ee9ca7, #ffdde1)';
    }
    
    return value || '#ffffff';
  };

  const fontStyle = {
    fontFamily: customization.font?.family || 'system-ui, sans-serif',
    fontSize: getFontSize(customization.font?.size),
    color: customization.font?.color || '#333333',
    fontWeight: customization.font?.weight || 'normal',
    textAlign: customization.font?.alignment as any || 'left',
  };

  const cardStyle = {
    background: getBackgroundStyle(),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '2rem',
    minHeight: '500px', // Increased for better preview
    height: '100%',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '1rem',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };
  
  // Add semi-transparent overlay for better text readability on image backgrounds
  const overlayStyle = customization.background.type === 'image' ? {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 0,
  } : {};

  const contentStyle = {
    position: 'relative' as const,
    zIndex: 1,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '1rem',
    height: '100%',
    ...fontStyle
  };

  function getFontSize(size?: string) {
    switch (size) {
      case 'small': return '0.875rem';
      case 'large': return '1.25rem';
      case 'medium': 
      default: return '1rem';
    }
  }

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

  const handleAddToCalendar = (type: 'google' | 'ics') => {
    if (!date) return;
    
    try {
      const startDate = new Date(`${date}T${time || '00:00:00'}`);
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1); // Default to 1 hour duration
      
      const eventData = {
        title: title || 'Untitled Event',
        description: description || '',
        location: location || '',
        start: startDate,
        end: endDate,
        isAllDay: !time
      };
      
      if (type === 'google') {
        const googleUrl = createGoogleCalendarUrl(eventData);
        window.open(googleUrl, '_blank');
      } else if (type === 'ics') {
        createICSFile(eventData);
      }
    } catch (error) {
      console.error('Error adding to calendar:', error);
    }
  };

  return (
    <Card style={cardStyle} className="w-full shadow-lg">
      {customization.background.type === 'image' && <div style={overlayStyle}></div>}
      
      <div style={contentStyle}>
        <div className="mb-2">
          <h2 className="text-2xl font-semibold mb-1">{title}</h2>
          {date && (
            <div className="flex items-center gap-1 opacity-90">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-sm">{formatDate(date, time)}</span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <p className="mb-4 whitespace-pre-wrap">{description}</p>
          
          {location && (
            <div className="text-sm mt-4">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <div>
                  {locationTitle && <p className="font-medium">{locationTitle}</p>}
                  <p className="opacity-90">{formatLocation(location)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {showActions && (
          <div className="mt-4 flex flex-wrap gap-2">
            {location && (
              <Button 
                size="sm"
                variant="outline"
                className="bg-white/70 backdrop-blur-sm hover:bg-white/90 text-foreground"
                asChild
              >
                <a 
                  href={generateDirectionsUrl(location)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Get Directions
                </a>
              </Button>
            )}
            
            {isEvent && date && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-white/70 backdrop-blur-sm hover:bg-white/90 text-foreground"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Add to Calendar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleAddToCalendar('google')}>
                    Google Calendar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddToCalendar('ics')}>
                    <Download className="h-4 w-4 mr-1" />
                    Download .ics (Apple/Outlook)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
