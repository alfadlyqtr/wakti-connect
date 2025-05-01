
import React from 'react';
import { SimpleInvitationCustomization, TextPosition, ButtonPosition } from '@/types/invitation.types';
import { Card } from '@/components/ui/card';
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

  // Get the vertical content positioning style
  const getContentPositionStyle = () => {
    const contentPosition = customization.textLayout?.contentPosition || 'middle';
    const spacing = customization.textLayout?.spacing || 'normal';
    
    // Base styles
    const style: React.CSSProperties = {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      ...fontStyle
    };
    
    // Set spacing between elements
    switch(spacing) {
      case 'compact':
        style.gap = '0.5rem';
        break;
      case 'spacious':
        style.gap = '1.5rem';
        break;
      case 'normal':
      default:
        style.gap = '1rem';
    }
    
    // Set vertical content alignment
    switch(contentPosition) {
      case 'top':
        style.justifyContent = 'flex-start';
        break;
      case 'bottom':
        style.justifyContent = 'flex-end';
        break;
      case 'middle':
      default:
        style.justifyContent = 'center';
    }
    
    return style;
  };

  // Get style for button based on position
  const getButtonContainerStyle = (position: ButtonPosition = 'bottom-right') => {
    const style: React.CSSProperties = {
      position: 'absolute',
      zIndex: 2,
    };
    
    switch(position) {
      case 'bottom-left':
        style.bottom = '1rem';
        style.left = '1rem';
        break;
      case 'bottom-center':
        style.bottom = '1rem';
        style.left = '50%';
        style.transform = 'translateX(-50%)';
        break;
      case 'top-right':
        style.top = '1rem';
        style.right = '1rem';
        break;
      case 'bottom-right':
      default:
        style.bottom = '1rem';
        style.right = '1rem';
    }
    
    return style;
  };

  // Get style for custom button
  const getButtonStyle = (buttonType: 'directions' | 'calendar') => {
    const buttonConfig = buttonType === 'directions' 
      ? customization.buttons?.directions
      : customization.buttons?.calendar;
    
    if (!buttonConfig) return {};
    
    const style: React.CSSProperties = {
      backgroundColor: buttonConfig.background || '#ffffff',
      color: buttonConfig.color || '#000000',
    };
    
    // Apply border radius based on shape
    switch(buttonConfig.shape) {
      case 'pill':
        style.borderRadius = '9999px';
        break;
      case 'square':
        style.borderRadius = '0';
        break;
      case 'rounded':
      default:
        style.borderRadius = '0.375rem';
    }
    
    return style;
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

  const showDirectionsButton = location && customization.buttons?.directions?.show !== false;
  const showCalendarButton = isEvent && date && customization.buttons?.calendar?.show !== false;

  return (
    <Card style={cardStyle} className="w-full shadow-lg">
      {customization.background.type === 'image' && <div style={overlayStyle}></div>}
      
      <div style={getContentPositionStyle()}>
        <div className="mb-2">
          <h2 className="text-2xl font-semibold mb-1">{title}</h2>
          {date && (
            <div className="flex items-center gap-1 opacity-90">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-sm">{formatDate(date, time)}</span>
            </div>
          )}
        </div>
        
        <div className="flex-grow">
          <p className="mb-4 whitespace-pre-wrap">{description}</p>
          
          {location && (
            <div className="text-sm mt-4">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <div>
                  {locationTitle && <p className="font-medium">{locationTitle}</p>}
                  {/* Only show formatted location, not the full URL */}
                  <p className="opacity-90">{formatLocation(location)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Position Get Directions button */}
      {showActions && showDirectionsButton && (
        <div style={getButtonContainerStyle(customization.buttons?.directions?.position)}>
          <button 
            className="flex items-center px-4 py-2 text-sm font-medium backdrop-blur-sm"
            style={getButtonStyle('directions')}
            onClick={() => window.open(generateDirectionsUrl(location || ''), '_blank')}
          >
            <MapPin className="h-4 w-4 mr-1" />
            Get Directions
          </button>
        </div>
      )}
      
      {/* Position Calendar button */}
      {showActions && showCalendarButton && (
        <div style={getButtonContainerStyle(customization.buttons?.calendar?.position)}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center px-4 py-2 text-sm font-medium backdrop-blur-sm"
                style={getButtonStyle('calendar')}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Add to Calendar
              </button>
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
        </div>
      )}
    </Card>
  );
}
