
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { InvitationStyle } from "@/types/invitation.types";
import { Appointment } from "@/types/appointment.types";
import { respondToInvitation } from "@/services/invitation/invitationService";

interface InvitationCardProps {
  appointment: Appointment;
  invitationId: string;
  style: InvitationStyle;
  recipientName?: string;
  showRespond?: boolean;
  headerImage?: string;
  mapLocation?: string;
  layoutSize?: 'small' | 'medium' | 'large';
  onRespond?: (response: 'accepted' | 'declined') => void;
}

const InvitationCard: React.FC<InvitationCardProps> = ({
  appointment,
  invitationId,
  style,
  recipientName,
  showRespond = false,
  headerImage,
  mapLocation,
  layoutSize = 'medium',
  onRespond
}) => {
  const startDate = new Date(appointment.start_time);
  const endDate = new Date(appointment.end_time);
  
  // Handle response to invitation
  const handleRespond = async (response: 'accepted' | 'declined') => {
    try {
      await respondToInvitation(invitationId, response);
      if (onRespond) {
        onRespond(response);
      }
    } catch (error) {
      console.error(`Error ${response} invitation:`, error);
    }
  };
  
  // Generate background style
  const getBackgroundStyle = () => {
    const { type, value } = style.background;
    
    if (type === 'gradient') {
      return { background: value };
    } else if (type === 'image' && value) {
      return { 
        backgroundImage: `url(${value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    } else {
      return { backgroundColor: value };
    }
  };
  
  // Get font sizes based on layout size
  const getFontSizes = () => {
    switch (layoutSize) {
      case 'small':
        return { title: 'text-lg', body: 'text-xs' };
      case 'large':
        return { title: 'text-2xl', body: 'text-base' };
      case 'medium':
      default:
        return { title: 'text-xl', body: 'text-sm' };
    }
  };
  
  // Get padding based on layout size
  const getPadding = () => {
    switch (layoutSize) {
      case 'small':
        return 'p-3';
      case 'large':
        return 'p-6';
      case 'medium':
      default:
        return 'p-4';
    }
  };
  
  const fontSizes = getFontSizes();
  const padding = getPadding();
  
  // Shadow effect
  const shadowClass = style.shadow ? 'shadow-lg' : '';
  
  return (
    <Card 
      className={`overflow-hidden ${shadowClass} transition-all duration-300 hover:shadow-xl max-w-md mx-auto`}
      style={{
        fontFamily: style.fontFamily || 'Inter',
        textAlign: style.textAlign as any || 'center',
        ...getBackgroundStyle()
      }}
    >
      {/* Header/Banner */}
      {(headerImage || style.headerStyle === 'banner') && (
        <div 
          className="w-full h-32 bg-cover bg-center" 
          style={{ 
            backgroundImage: headerImage ? `url(${headerImage})` : 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)'
          }}
        />
      )}
      
      {/* Content */}
      <div className={`${padding} space-y-4`}>
        {/* Title */}
        <h3 
          className={`font-bold ${fontSizes.title} leading-tight`}
          style={{ color: style.background.type === 'solid' ? undefined : '#ffffff' }}
        >
          {appointment.title}
        </h3>
        
        {recipientName && (
          <p className={`${fontSizes.body} opacity-75`}>
            Dear {recipientName}, you're invited to:
          </p>
        )}
        
        {appointment.description && (
          <p className={`${fontSizes.body} opacity-90`}>
            {appointment.description}
          </p>
        )}
        
        {/* Date & Time */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className={fontSizes.body}>{format(startDate, "EEEE, MMMM d, yyyy")}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span className={fontSizes.body}>
              {appointment.is_all_day 
                ? "All day" 
                : `${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}`}
            </span>
          </div>
          
          {appointment.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className={fontSizes.body}>{appointment.location}</span>
            </div>
          )}
        </div>
        
        {/* Map Location */}
        {mapLocation && (
          <div className="mt-3 rounded overflow-hidden">
            <iframe
              title="Location Map"
              width="100%"
              height="150"
              frameBorder="0"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapLocation)}&output=embed`}
              allowFullScreen
            />
          </div>
        )}
        
        {/* Response Buttons */}
        {showRespond && (
          <div className="flex justify-center gap-3 pt-3">
            <Button
              onClick={() => handleRespond('accepted')}
              className="px-6"
              style={{
                backgroundColor: style.buttons?.accept?.background || '#4CAF50',
                color: style.buttons?.accept?.color || '#ffffff'
              }}
            >
              Accept
            </Button>
            <Button
              onClick={() => handleRespond('declined')}
              variant="outline"
              className="px-6"
              style={{
                backgroundColor: style.buttons?.decline?.background || '#f44336',
                color: style.buttons?.decline?.color || '#ffffff'
              }}
            >
              Decline
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default InvitationCard;
